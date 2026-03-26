import { es } from "@/lib/elasticsearch";

export async function getConcepts(domain?: string) {
  const must: any[] = [];

  if (domain && domain !== "All") {
    must.push({ term: { "domain.keyword": domain } });
  }

  const result = await es.search({
    index: "notes_nlp",
    size: 0,
    query: {
      bool: { must },
    },
    aggs: {
      top_concepts: {
        terms: {
          field: "concept_id.keyword",
          size: 50,
        },
        aggs: {
          concept_name: {
            top_hits: {
              _source: ["concept_name"],
              size: 1,
            },
          },
        },
      },
    },
  });

  const buckets = (result.aggregations?.top_concepts as any)?.buckets || [];

  return buckets.map((b: any) => ({
    concept_id: b.key,
    name: b.concept_name.hits.hits[0]._source.concept_name,
    count: b.doc_count,
  }));
}

export async function getNotesForConcept(conceptId: string) {
  const resultConcept = await es.search({
    index: "notes_nlp",
    size: 100,
    query: {
      term: {
        concept_id: conceptId,
      },
    },
  });
  const conceptName =
    (resultConcept.hits.hits[0]?._source as any)?.concept_name || conceptId;
  const noteIds = resultConcept.hits.hits.map((h: any) => h._source.note_id);

  if (noteIds.length === 0) return [];

  const notes = await es.search({
    index: "notes",
    size: 100,
    query: {
      terms: {
        note_id: noteIds,
      },
    },
  });

  return {
    conceptId,
    conceptName,
    notes: notes.hits.hits.map((n: any) => n._source),
  };
}
