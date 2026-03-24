import { es } from '@/lib/elasticsearch';

export async function getConcepts() {
    const result = await es.search({
    index: 'notes_nlp',
    size: 0,
    aggs: {
      top_concepts: {
        terms: {
          field: 'concept_id.keyword',
          size: 50
        }
      }
    }
  });

  const buckets = (result.aggregations?.top_concepts as any)?.buckets || [];

  return buckets.map((b: any) => ({
    concept_id: b.key,
    count: b.doc_count
  }));
}

export async function getNotesForConcept(conceptId: string) {
    console.log('Fetching notes for concept:', conceptId);
    const resultConcept = await es.search({
        index: 'notes_nlp',
        size: 100,
        query: {
            term: {
                concept_id: conceptId
            }
        }
    });

    const noteIds = resultConcept.hits.hits.map(
        (h: any) => h._source.note_id
    );

    if (noteIds.length === 0) return [];

    const notes = await es.search({
        index: 'notes',
        size: 100,
        query: {
            terms: {
                note_id: noteIds
            }
        }
    });

    return notes.hits.hits.map((n: any) => n._source);
}