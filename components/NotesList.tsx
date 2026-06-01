import NoteCard from "./NoteCard";
import { Note } from "@/types/OmopTables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMultiplePmcArticles } from "@/lib/services/pmcService";
import { Badge } from "@/components/ui/badge";
import { ConceptHover } from "./ConceptHover";
export default async function NotesList({
  relatedConcepts,
  notes,
  conceptDetails,
  total
}: {
  relatedConcepts: Array<{
    inputConceptId: string;
    groupConcepts: Array<{
      conceptId: string;
      conceptName: string;
    }>;
  }>;
  notes: Note[];
  conceptDetails: Array<{
    conceptId: string;
    conceptName: string;
    domain: string;
  }>;
  total: number;
}) {
  // Sort the PMC IDs for caching
  const pmcids = Array.from(
    new Set(
      notes
        .map((note) => note.note_source_value?.match(/PMC(\d+)/)?.[1])
        .filter((id): id is string => Boolean(id)),
    ),
  ).sort();
  if (pmcids.length === 0) return;
  const articles =
    pmcids.length > 0 ? await getMultiplePmcArticles(pmcids) : {};

  return (
    <Card className="col-span-2 ring-0" >
      <CardHeader>
        <CardTitle className="flex flex-wrap gap-2 items-center">
          <span className="text-2xl">Case Reports for: </span>

          {conceptDetails.map((c) => {
            const related = relatedConcepts.find(
              (r) => r.inputConceptId === c.conceptId,
            );
            return (
              <ConceptHover
                key={c.conceptId}
                conceptName={c.conceptName}
                relatedConcepts={related?.groupConcepts}
              />
            );
          })}
                      

        </CardTitle>
        <div className="text-sm text-muted-foreground">{total} results</div>
      </CardHeader>

      <CardContent>
        {!conceptDetails ? (
          <div className="text-muted-foreground text-center py-10">
            Select a concept from the sidebar to view the associated Case
            Reports.
          </div>
        ) : notes.length === 0 ? (
          <div className="text-muted-foreground text-center py-10">
            No notes found for
            {conceptDetails.map((c) => c.conceptName).join(", ")}.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            
            <div className=" flex items-center gap-2">
              <Badge variant="outline" className="bg-sky-100 dark:bg-[#1B3C53]">
                Condition
              </Badge>
              <Badge
                variant="outline"
                className="bg-emerald-100 dark:bg-[#3F4F44]"
              >
                Drug
              </Badge>
              <Badge
                variant="outline"
                className="bg-violet-100 dark:bg-[#49243E]"
              >
                Procedure
              </Badge>
              <Badge
                variant="outline"
                className="bg-orange-100 dark:bg-amber-800"
              >
                Measurement
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 py-1">
            {notes.map((note) => {
              const pmcid = note.note_source_value?.match(/PMC(\d+)/)?.[1];

              return (
                <NoteCard
                  key={note.note_id}
                  note={note}
                  article={pmcid ? articles[pmcid] : null}
                />
              );
            })}
          </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
