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
            <Button variant="outline" onClick={loadArticle}>
              Go to Article
              <ArrowRightIcon />
            </Button>
          )}
        </p>
      </CardContent>

      <CardFooter className="bg-white border-t-gray-200">
        <div className="flex flex-wrap gap-2">
          {uniqueConcepts.map((c: any) => (
            <Badge 
              variant={"secondary"}
              key={c.concept_id}
              className={`flex flex-wrap gap-2 text-sm px-4 py-0
              ${c.domain === "Condition" ? "bg-sky-100" : ""}
              ${c.domain === "Drug" ? "bg-emerald-100" : ""}
            `}
            >
              {c.concept_name}
            </Badge>
          ))}
        </div>
      </CardFooter>
      
    </Card>
   
  );
}
