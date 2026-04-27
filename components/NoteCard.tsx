"use client";
import { Concept, Note } from "@/types/OmopTables";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, ChevronDown } from "lucide-react";

export default function NoteCard({
  note,
  article,
}: {
  note: Note;
  article: any;
}) {
  const pmcid = note.note_source_value?.match(/PMC(\d+)/)?.[1];

  const uniqueConcepts = Array.from(
    new Map((note.concepts || []).map((c: any) => [c.concept_id, c])).values(),
  );

  const openArticle = () => {
    if (article?.articleUrl) {
      window.open(article.articleUrl, "_blank");
    } else {
      alert("No article found");
    }
  };

  return (
    <Card className="bg-zinc-50 ring-foreground/15 dark:bg-neutral-800 mb-5">
      <CardHeader>
        <CardTitle className="text-lg">
          {article ? (
            <p>{article.title}</p>
          ) : (
            <p className="text-sm text-gray-400">Loading article...</p>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-2 md:flex-row">
        {article ? (
          <Collapsible className="rounded-md data-[state=open]:bg-muted">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="group w-full">
                Description
                <ChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
              {article.description}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <p className="text-sm text-gray-400">Loading article...</p>
        )}

        <p>
          {pmcid && (
            <Button variant="ghost" onClick={openArticle}>
              Go to Article
              <ArrowRightIcon />
            </Button>
          )}
        </p>
      </CardContent>

      <CardFooter className="bg-neutral-50 border-t-gray-200 dark:bg-neutral-900 dark:border-t-neutral-600">
        <div className="flex flex-wrap gap-2">
          {uniqueConcepts.map((c: Concept) => (
            <Badge
              variant={"secondary"}
              key={c.concept_id}
              className={`flex flex-wrap gap-2 text-sm py-0
              ${c.domain === "Condition" ? "bg-sky-100 dark:bg-[#1B3C53]" : ""}
              ${c.domain === "Drug" ? "bg-emerald-100 dark:bg-[#3F4F44]" : ""}
              ${c.domain === "Procedure" ? "bg-violet-100 dark:bg-[#49243E]" : ""}
              ${c.domain === "Measurement" ? "bg-orange-100 dark:bg-amber-800" : ""}
              `}
            >
              {c.name}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
