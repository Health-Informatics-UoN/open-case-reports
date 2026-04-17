import NotesList from "./NotesList";
import { getNotesForConcept } from "@/lib/services/conceptsService";

export default async function NotesSection({
  conceptId,
}: {
  conceptId: string | null;
}) {
  if (!conceptId) {
    return (
      <div className="text-muted-foreground text-center py-10">
        Select a concept from the sidebar to view the associated Case Reports.
      </div>
    );
  }

  const data = await getNotesForConcept(conceptId);

  return (
    <NotesList
      notes={data.notes}
      conceptId={conceptId}
      conceptName={data.conceptName}
    />
  );
}