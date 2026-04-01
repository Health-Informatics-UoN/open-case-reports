import NoteCard from './NoteCard';
import { Note } from '@/types/OmopTables';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

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
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-2xl">
          {conceptId && conceptName
            ? `Notes for ${conceptName}`
            : 'No term selected'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!conceptId ? (
          <div className="text-muted-foreground text-center py-10">
            Select a concept from the sidebar to view the associated Case Reports.
          </div>
        ) : notes.length === 0 ? (
          <div className="text-muted-foreground text-center py-10">
            No notes found for {conceptName}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <NoteCard key={note.note_id} note={note} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}