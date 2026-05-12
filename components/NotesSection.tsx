import { getNotesForConcept } from "@/lib/services/conceptsService";
import NotesPagination from "./NotesPagination";
import NotesList from "./NotesList";

export default async function NotesSection({
  conceptIds,
  page,
}: {
  conceptIds: string[];
  page: number;
}) {
  if (!conceptIds || conceptIds.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-10">
        Select a concept from the sidebar to view the associated Case Reports.
      </div>
    );
  }

  const { conceptDetails, relatedConcepts, notes, total } = await getNotesForConcept(
    conceptIds,
    page,
  );

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="p-4 space-y-4">
      <NotesList
        relatedConcepts={relatedConcepts}
        notes={notes}
        conceptDetails={conceptDetails}
        total={total}
      />
      <NotesPagination page={page} totalPages={totalPages} />
    </div>
  );
}
