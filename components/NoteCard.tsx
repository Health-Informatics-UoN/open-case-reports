import { Note } from "@/types/OmopTables";
import { useState } from "react";

export default function NoteCard({ note }: { note: Note }) {
  const pmcid = note.note_source_value?.match(/PMC(\d+)/)?.[1];
  const [article, setArticle] = useState<any>(null);
  const uniqueConcepts = Array.from(
    new Map((note.concepts || []).map((c: any) => [c.concept_id, c])).values(),
  );
  const loadArticle = async () => {
    if (!pmcid) return;
    const res = await fetch(`/api/pmc?pmcid=${pmcid}`);
    const data = await res.json();
    setArticle(data);
    if (data.articleUrl) {
      window.open(data.articleUrl, "_blank");
    } else {
      alert("No article found");
    }
  };

  return (
   
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="text-sm text-gray-500">Note ID: {note.note_id}</div>
      <div className="text-sm text-gray-500">PMC ID: {pmcid || "N/A"}</div>
      <div className="text-sm">Date: {note.note_date}</div>

      {pmcid && (
        <div
        onClick={loadArticle}
        >
        Go to Article
 
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {uniqueConcepts.map((c: any) => (
          <span
            key={c.concept_id}
            className={`px-2 py-1 text-xs rounded-md
              ${c.domain === "Condition" ? "bg-red-100" : ""}
              ${c.domain === "Drug" ? "bg-green-100" : ""}
            `}
          >
            {c.concept_name}
          </span>
        ))}
      </div>
    </div>
  );
}
