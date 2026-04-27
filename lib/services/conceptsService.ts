import { getElasticClient } from "@/lib/elasticsearch";
import { Note } from "@/types/OmopTables";

async function getConceptsFromNotes() {
  const es = getElasticClient();

  const result = await es.search({
    index: "notes",
    size: 0,
    aggs: {
      top_concepts: {
        terms: {
          field: "concepts",
          size: 100,
        },
      },
    },
  });

  const buckets = (result.aggregations as any)?.top_concepts?.buckets || [];

  return buckets.map((b: any) => ({
    concept_id: b.key,
    count: b.doc_count,
  }));
}

async function getConceptMetadata(conceptIds: string[]) {
  if (!conceptIds.length) return [];

  const es = getElasticClient();

  const result = await es.search({
    index: "concepts",
    size: conceptIds.length,
    query: {
      terms: {
        concept_id: conceptIds,
      },
    },
  });

  return result.hits.hits.map((h: any) => h._source);
}

export async function getConcepts(domain?: string) {
  "use cache";
  // Get commonly occuring Concepts from Notes
  const topConcepts = await getConceptsFromNotes();

  const ids = topConcepts.map((c: { concept_id: any }) => c.concept_id);

  // Get Concept Name and Domain for each Concept ID
  const metadata = await getConceptMetadata(ids);

  const metaMap = new Map(metadata.map((m: any) => [m.concept_id, m]));

  // Step 3: merge
  let concepts = topConcepts.map((c: { concept_id: any; count: any }) => {
    const meta = metaMap.get(c.concept_id);

    return {
      concept_id: c.concept_id,
      name: meta?.concept_name ?? "Unknown",
      domain: meta?.domain ?? "Unknown",
      count: c.count,
    };
  });

  // Filter by domain
  if (domain && domain !== "All") {
    concepts = concepts.filter((c: { domain: string }) => c.domain === domain);
  }

  // Sort by count
  concepts.sort(
    (a: { count: number }, b: { count: number }) => b.count - a.count,
  );

  return concepts;
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
  notes: Note[];
  total: number;
}> {
  "use cache";
  const es = getElasticClient();

  // Set pagination
  const size = 10;

  const query =
    conceptIds.length === 0
      ? { match_all: {} }
      : {
          bool: {
            filter: conceptIds.map((id) => ({
              term: { concepts: id },
            })),
          },
        };
  // Get Notes that include the Concept
  const notesResult = await es.search({
    index: "notes",
    from: (page - 1) * size,
    size,
    sort: [{ note_id: "asc" }],
    track_total_hits: true,
    query,
  });

  const rawNotes = notesResult.hits.hits.map((h: any) => h._source);
  // Get all Concept IDs from the Notes
  const allConceptIds = Array.from(
    new Set(rawNotes.flatMap((n: any) => n.concepts || [])),
  );

  // Map each Concept ID to Concept Name and Domain
  let conceptMap = new Map<string, { concept_name: string; domain: string }>();
  if (allConceptIds.length > 0) {
    const conceptResult = await es.search({
      index: "concepts",
      size: allConceptIds.length,
      query: {
        terms: {
          concept_id: allConceptIds,
        },
      },
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

  const conceptDetails = conceptIds.map((id) => {
    const concept = conceptMap.get(id);

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
    notes,
    total: total ? total : 0,
  };
}
