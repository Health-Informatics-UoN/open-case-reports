"use client";

import { useEffect, useState } from "react";
import ConceptList from "@/components/ConceptList";
import NotesList from "@/components/NotesList";
import { Note, Concept } from "@/types/OmopTables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          console.error("Concepts is not an array:", data);
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
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Open Case Reports</h1>
        <p className="text-muted-foreground">
          Browse common terms and find associated Case Reports
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Filters</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium">Domain</span>

            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Condition">Condition</SelectItem>
                <SelectItem value="Drug">Drug</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-0 md:col-span-1">
          <ConceptList concepts={concepts} onSelect={loadNotes} />
        </Card>

        <Card className="p-0 md:col-span-2">
          <NotesList
            notes={notes}
            conceptId={selectedConcept}
            conceptName={conceptName}
          />
        </Card>
      </div>
    </div>
  );
}
