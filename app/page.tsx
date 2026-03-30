"use client";

import { useEffect, useState } from "react";
import ConceptList from "@/components/ConceptList";
import NotesList from "@/components/NotesList";
import { Note, Concept } from "@/types/OmopTables";

export default function Home() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [domain, setDomain] = useState("All");
  const [conceptName, setConceptName] = useState<string | null>(null);

  // Filter concepts by domain
  useEffect(() => {
    fetch(`/api/concepts?domain=${domain}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setConcepts(data);
        } else {
          console.error("Concepts is not array:", data);
          setConcepts([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setConcepts([]);
      });
  }, [domain]);

  const loadNotes = async (conceptId: string) => {
    setSelectedConcept(conceptId);

    const res = await fetch(`/api/notes?conceptId=${conceptId}`);
    const data = await res.json();

    setNotes(data.notes);
    setConceptName(data.conceptName);
  };

  return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Open Case Reports</h1>

        <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">
          <label className="font-semibold">Domain:</label>
          <select
            className="border rounded-lg px-3 py-2"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option>All</option>
            <option>Condition</option>
            <option>Drug</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <ConceptList concepts={concepts} onSelect={loadNotes} />
          <NotesList
            notes={notes}
            conceptId={selectedConcept}
            conceptName={conceptName}
          />
        </div>
      </div>
  );
}
