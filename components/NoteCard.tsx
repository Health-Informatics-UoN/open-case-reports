import { Note } from "@/types/OmopTables";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle>PMC ID: {pmcid || "N/A"}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2 md:flex-row">

        <p>
          {pmcid && (
            <Button variant="outline" size="sm" onClick={loadArticle}>
              Go to Article
              <ArrowRightIcon />
            </Button>
          )}
        </p>
      </CardContent>

      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {uniqueConcepts.map((c: any) => (
            <span
              key={c.concept_id}
              className={`px-2 py-1 text-xs rounded-md
              ${c.domain === "Condition" ? "bg-sky-100" : ""}
              ${c.domain === "Drug" ? "bg-emerald-100" : ""}
            `}
            >
              <Badge variant="ghost">
                {c.concept_name}
              </Badge>
            </span>
          ))}
        </div>
      </CardFooter>
      
    </Card>
   
  );
}
