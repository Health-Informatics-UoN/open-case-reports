'use client';

import { useEffect, useState } from 'react';
import { Concept, Note } from '@/types/OmopTables';

export default function Home() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/concepts')
      .then(res => res.json())
      .then((data: Concept[]) => setConcepts(data));
  }, []);

  const loadNotes = async (conceptId: string) => {
    setSelectedConcept(conceptId);

    const res = await fetch(`/api/notes?conceptId=${conceptId}`);
    const data: Note[] = await res.json();
    setNotes(data);
  };
  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      {/* Concepts */}
      <div>
        <h2>Top Concepts</h2>
        <ul>
          {concepts.map((c) => (
            <li key={c.concept_id}>
              <button onClick={() => loadNotes(c.concept_id)}>
                {c.concept_id} ({c.count})
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      <div>
        <h2>Notes for Concept: {selectedConcept}</h2>
        {notes.map((note) => (
          <div key={note.note_id} style={{ marginBottom: 20 }}>
            <div><b>Note ID:</b> {note.note_id}</div>
            <div><b>Person ID:</b> {note.person_id}</div>
            <div><b>Date:</b> {note.note_date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}