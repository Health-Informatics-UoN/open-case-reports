import { getElasticClient } from "@/lib/elasticsearch";
import { Concept, Note } from "@/types/OmopTables";
import type { estypes } from "@elastic/elasticsearch";
type AggregatedTerms = {
  buckets: Array<{
    key: string;
    doc_count: number;
  }>;
};

export async function getConcepts(domain?: string): Promise<
  Array<{
    concept_id: string;
    name: string;
    domain: string;
    group_ids: string[];
  }>
> {
  const es = getElasticClient();
  // Get most commonly mapped concepts
  const notes = await es.search({
    index: "notes",
    size: 0,
    aggs: {
      concepts: {
        terms: {
          field: "concepts",
          size: 1000,
        },
      },
    },
  });

  const buckets =
    (notes.aggregations?.concepts as AggregatedTerms)?.buckets ?? [];

  const conceptIds = buckets.map((b) => b.key as string);

  if (conceptIds.length === 0) return [];

  const must: estypes.QueryDslQueryContainer[] = [
    { terms: { concept_id: conceptIds } },
  ];

  // Domain filter
  if (domain && domain !== "All") {
    must.push({
      term: { domain },
    });
  }

  // Get Condition Concepts with mapped group_ids
  const filter: estypes.QueryDslQueryContainer[] = [];

  const effectiveDomain = domain && domain !== "All" ? domain : null;

  if (!effectiveDomain || effectiveDomain === "Condition") {
    filter.push({
      term: { has_group_ids: true },
    });
  }

  // Get Concepts with group_ids with domain filter
  const result = await es.search<{
    concept_id: string;
    concept_name: string;
    domain: string;
    group_ids?: string[];
  }>({
    index: "concepts",
    size: 100,
    track_total_hits: true,
    query: {
      bool: {
        must,
        filter,
      },
    },
    _source: ["concept_id", "concept_name", "domain", "group_ids"],
  });

  return result.hits.hits.map((h): Concept => {
    const c = h._source!;

    return {
      concept_id: c.concept_id,
      name: c.concept_name,
      domain: c.domain,
      group_ids: c.group_ids ?? [],
    };
  });
}

export async function getGroupConceptIdsById(conceptId: string): Promise<{
  inputConceptId: string;
  groupId?: string;
  groupConcepts: Array<{
    conceptId: string;
    conceptName: string;
  }>;
}> {
  const es = getElasticClient();

  // Get Concept by ID
  const conceptResult = await es.search<{
    concept_id: string;
    concept_name: string;
    group_ids?: string[];
  }>({
    index: "concepts",
    size: 1,
    query: {
      term: {
        concept_id: conceptId,
      },
    },
    _source: ["concept_id", "concept_name", "group_ids"],
  });

  const concept = conceptResult.hits.hits[0]?._source;
  if (!concept) {
    return {
      inputConceptId: conceptId,
      groupConcepts: [],
    };
  }

  const groupId = concept.group_ids?.[0];

  // If no group return the original concept
  if (!groupId) {
    return {
      inputConceptId: conceptId,
      groupConcepts: [
        {
          conceptId: concept.concept_id,
          conceptName: concept.concept_name,
        },
      ],
    };
  }

  // Get all concepts in group
  const groupResult = await es.search<{
    concept_id: string;
    concept_name: string;
  }>({
    index: "concepts",
    size: 1000,
    query: {
      term: {
        group_ids: groupId,
      },
    },
    _source: ["concept_id", "concept_name"],
  });

  const relatedConcepts = groupResult.hits.hits.map((h) => {
    const c = h._source!;
    return {
      conceptId: c.concept_id,
      conceptName: c.concept_name,
    };
  });

  // Remove any duplicates
  const cleanConcepts = Array.from(
    new Map(relatedConcepts.map((c) => [c.conceptId, c])).values(),
  );

  return {
    inputConceptId: conceptId,
    groupConcepts: cleanConcepts,
  };
}

export async function getNotesForConcept(
  conceptIds: string[],
  page: number,
): Promise<{
  conceptDetails: Array<{
    conceptId: string;
    conceptName: string;
    domain: string;
  }>;
  relatedConcepts: Array<{
    inputConceptId: string;
    groupConcepts: Array<{
      conceptId: string;
      conceptName: string;
    }>;
  }>;
  notes: Note[];
  total: number;
}> {
  const es = getElasticClient();

  // Sort concept IDs
  const sortedConceptIds = [...conceptIds].sort();
  // Set pagination
  const size = 10;

  const groupConcepts = await Promise.all(
    sortedConceptIds.map((id) => getGroupConceptIdsById(id)),
  );

  // Set AND clause between selected concepts (must)
  // OR clause between grouped concepts (terms)
  const query =
    groupConcepts.length === 0
      ? { match_all: {} }
      : {
          bool: {
            must: groupConcepts.map((group) => ({
              terms: {
                concepts: group.groupConcepts.map((c) => c.conceptId),
              },
            })),
          },
        };
  // Get Notes that include the Concepts
  const notesResult = await es.search<{
    note_id: string;
    person_id?: string;
    note_source_value?: string;
    concepts?: string[];
  }>({
    index: "notes",
    from: (page - 1) * size,
    size,
    sort: [{ note_id: "asc" }],
    track_total_hits: true,
    query,
  });

  const rawNotes = notesResult.hits.hits.map((h) => h._source!).filter(Boolean);
  // Get all Concept IDs from the Notes
  const allConceptIds = Array.from(
    new Set(rawNotes.flatMap((n) => n.concepts ?? [])),
  );

  // Map each Concept ID to Concept Name and Domain
  let conceptMap = new Map<string, { concept_name: string; domain: string }>();
  const allRelevantConceptIds = Array.from(
    new Set([
      ...sortedConceptIds, // selected concepts
      ...allConceptIds,   // from notes
    ]),
  );
  if (allRelevantConceptIds.length > 0) {
    const conceptResult = await es.search<{
      concept_id: string;
      concept_name: string;
      domain: string;
    }>({
      index: "concepts",
      size: 1000,
      query: {
        bool: {
          filter: [
            {
              terms: {
                concept_id: allRelevantConceptIds,
              },
            },
          ],
        },
      },
      _source: ["concept_id", "concept_name", "domain"],
    });

    conceptMap = new Map(
      conceptResult.hits.hits.map((h: any) => [
        h._source.concept_id,
        h._source,
      ]),
    );
  }

  // Set Concept Metadata for each Note
  const notes: Note[] = rawNotes.map((note: any) => ({
    note_id: note.note_id,
    person_id: note.person_id,
    note_source_value: note.note_source_value,
    concepts: (note.concepts || []).map((id: string) => {
      const meta = conceptMap.get(id);
      return {
        concept_id: id,
        name: meta?.concept_name ?? "Unknown",
        domain: meta?.domain ?? "Unknown",
      };
    }),
  }));

const conceptDetails = sortedConceptIds.map((id) => {
  const concept = conceptMap.get(String(id).trim());

  return {
    conceptId: id,
    conceptName: concept?.concept_name ?? id,
    domain: concept?.domain ?? "Unknown",
  };
});
  // number of total notes found
  const total =
    typeof notesResult.hits.total === "number"
      ? notesResult.hits.total
      : notesResult.hits.total?.value;

  return {
    conceptDetails,
    relatedConcepts: groupConcepts,
    notes,
    total: total ?? 0,
  };
}
