import NoteCard from './NoteCard';
import { Note } from '@/types/OmopTables';

export default function NotesList({
  notes,
  conceptId,
  conceptName
}: {
  notes: Note[];
  conceptId: string | null;
  conceptName: string | null;
}) {
  return (
    <div className="col-span-2 bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4">
        {conceptId && conceptName
          ? `Notes for ${conceptName}`
          : 'No term selected'}
      </h2>

      {!conceptId ? (
        <div className="text-gray-500 text-center mt-10">
          Select a concept from the sidebar to view the associated Case Reports.
        </div>
      ) : notes.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">
          No notes found for {conceptName}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.note_id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}