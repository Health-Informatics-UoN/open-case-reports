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
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildSearchParams } from "@/lib/helpers";
import { useTransition } from "react";

export default function NoteCard({
  note,
  article,
}: {
  note: Note;
  article: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const selectedConceptIds = searchParams.getAll("conceptId");

  const pmcid = note.note_source_value?.match(/PMC(\d+)/)?.[1];

  const uniqueConcepts = Array.from(
    new Map(
      (note.concepts || []).map((c: any) => [
        String(c.concept_id),
        {
          ...c,
          concept_id: String(c.concept_id),
        },
      ]),
    ).values(),
  );

  const selectConcept = (conceptId: string) => {
    const existing = searchParams.getAll("conceptId");

    const nextConceptIds = existing.includes(conceptId)
      ? existing.filter((id) => id !== conceptId)
      : [...existing, conceptId];

    const query = buildSearchParams({
      conceptIds: nextConceptIds,
      domain: searchParams.get("domain"),
      page: 1,
    });

    startTransition(() => {
      router.replace(`${pathname}?${query}`, {
        scroll: false,
      });
    });
  };

  return (
    <Card
      className={`
        bg-zinc-50 ring-foreground/15 dark:bg-neutral-800 mb-5
        transition-opacity
        ${isPending ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      <CardHeader>
        <CardTitle className="text-lg">
          {article?.articleUrl && pmcid ? (
            <Link
              href={article.articleUrl}
              target="_blank"
              className="hover:underline"
            >
              {article.title}
            </Link>
          ) : (
            <p className="text-sm text-gray-400">
              Loading Case Reports...
            </p>
          )}
        </CardTitle>

        {isPending && (
          <div className="text-sm text-muted-foreground">
            Loading Case Reports...
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-2 md:flex-row">
        {article ? (
          <Collapsible defaultOpen={true} className="w-full rounded-md data-[state=open]:bg-muted">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="group w-full bg-transparent"
              >
                Description

                <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
              {article.description}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <p className="text-sm text-gray-400">
            Loading Case Reports...
          </p>
        )}
      </CardContent>

      <CardFooter className="bg-neutral-50 border-t-gray-200 dark:bg-neutral-900 dark:border-t-neutral-600">
        <div className="flex flex-wrap gap-2">
          {uniqueConcepts.map((c: Concept) => {
            const selected = selectedConceptIds.includes(
              String(c.concept_id),
            );

            return (
              <Badge
                key={c.concept_id}
                variant="secondary"
                onClick={() => selectConcept(String(c.concept_id))}
                className={`
                  cursor-pointer transition hover:opacity-80
                  flex flex-wrap gap-2 py-0 text-sm

                  ${selected ? "ring-2 ring-primary" : ""}

                  ${
                    c.domain === "Condition"
                      ? "bg-sky-100 dark:bg-[#1B3C53]"
                      : ""
                  }

                  ${
                    c.domain === "Drug"
                      ? "bg-emerald-100 dark:bg-[#3F4F44]"
                      : ""
                  }

                  ${
                    c.domain === "Procedure"
                      ? "bg-violet-100 dark:bg-[#49243E]"
                      : ""
                  }

                  ${
                    c.domain === "Measurement"
                      ? "bg-orange-100 dark:bg-amber-800"
                      : ""
                  }
                `}
              >
                {c.name}
              </Badge>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}