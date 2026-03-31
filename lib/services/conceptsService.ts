import { getElasticClient } from "@/lib/elasticsearch";
import { cp } from "fs";

export async function getConcepts(domain?: string) {
  const result = await getElasticClient().search({
    index: "notes",
    size: 0,
    aggs: {
      concepts: {
        nested: { path: "concepts" },
        aggs: {
          filtered: {
            filter:
              domain && domain !== "All"
                ? { term: { "concepts.domain": domain } }
                : { match_all: {} },
            aggs: {
              top_concepts: {
                terms: {
                  field: "concepts.concept_id",
                  size: 50,
                },
                aggs: {
                  concept_name: {
                    top_hits: {
                      size: 1,
                      _source: ["concepts.concept_id", "concepts.concept_name"]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  const buckets =
    (result.aggregations as any)?.concepts?.filtered?.top_concepts?.buckets || [];
  return buckets.map((b: any) => {
    const hit = b.concept_name?.hits?.hits?.[0];
    const source = hit?._source;

    return {
      concept_id: source?.concept_id || b.key,
      name: source?.concept_name || "Unknown",
      count: b.doc_count,
    };
  });
}

export async function getNotesForConcept(conceptId: string) {
  const result = await getElasticClient().search({
    index: "notes",
    size: 100,
    query: {
      nested: {
        path: "concepts",
        query: {
          term: {
            "concepts.concept_id": conceptId,
          },
        },
      },
    },
  });

  const notes = result.hits.hits.map((n: any) => n._source);
  // Get concept name from first note
  let conceptName = conceptId;
  if (notes.length > 0) {
    const concept = notes[0].concepts.find(
      (c: any) => c.concept_id === conceptId,
    );
    if (concept) conceptName = concept.concept_name;
  }

  return {
    conceptId,
    conceptName,
    notes,
  };
}
