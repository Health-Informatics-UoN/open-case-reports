import NotesList from "./NotesList";
import { getNotesForConcept } from "@/lib/services/conceptsService";

export default async function NotesSection({
  conceptIds,
}: {
  conceptIds: string[]
}) {
  if (!conceptIds || conceptIds.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-10">
        Select a concept from the sidebar to view the associated Case Reports.
      </div>
    );
  }

  const data = await getNotesForConcept(conceptIds);

  return (
    <NotesList
      notes={data.notes}
      conceptIds={conceptIds}
      conceptName={data.conceptDetails.map((c) => c.conceptName).join(", ")}
    />
  );
}