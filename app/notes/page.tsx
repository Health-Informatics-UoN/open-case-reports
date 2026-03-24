import { getNotesForConcept } from '@/api/concepts';

export default async function NotesPage({ searchParams }: { searchParams: Record<string, string> }) {
  const conceptId = searchParams.conceptId;

  if (!conceptId) {
    return <div>Please select a concept.</div>;
  }

  const notes = await getNotesForConcept(conceptId);

  return (
    <div>
      <h1>Notes for Concept {conceptId}</h1>

      {notes.map((note) => (
        <div key={note.note_id} style={{ marginBottom: 20 }}>
          <div><b>Note ID:</b> {note.note_id}</div>
          <div><b>Person ID:</b> {note.person_id}</div>
          <div><b>Date:</b> {note.note_date}</div>
        </div>
      ))}
    </div>
  );
}