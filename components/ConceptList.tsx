"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Concept } from "@/types/OmopTables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { buildSearchParams } from "@/lib/helpers";
import { useEffect, useState } from "react";

export default function ConceptList({ concepts }: { concepts: Concept[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedConcepts = searchParams.getAll("conceptId")
  const [loading, setLoading] = useState(false);

  const onSelect = (conceptId: string) => {
    if (loading) return;

    setLoading(true);

    const current = searchParams.getAll("conceptId");

    const nextConceptIds = current.includes(conceptId)
      ? current.filter((id) => id !== conceptId)
      : [...current, conceptId];

    const query = buildSearchParams({
      conceptIds: nextConceptIds,
      domain: searchParams.get("domain"),
      page: 1,
    });

    router.replace(`${pathname}?${query}`, {
      scroll: false,
    });

  };
  useEffect(() => {
  setLoading(false);
}, [searchParams]);
  const clearSelection = () => {
    const query = buildSearchParams({
      conceptIds: [],
      domain: searchParams.get("domain"),
      page: 1,
    });

    router.replace(`${pathname}?${query}`, { scroll: false });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Common Search Terms</CardTitle>
        <Button variant="secondary" size="default" onClick={clearSelection}>
          Clear
        </Button>
      </CardHeader>
      <ScrollArea className="h-400">
        <CardContent>
          <div className="space-y-2">
            {concepts.map((c) => (
              <Button
                key={c.concept_id}
                variant={
                  selectedConcepts.includes(c.concept_id)
                    ? "secondary"
                    : "ghost"
                }
                className={`w-full justify-between h-auto py-3 px-4 ${
                  selectedConcepts.includes(c.concept_id)
                    ? "bg-mist-100 dark:bg-neutral-800"
                    : ""
                }`}
                onClick={() => onSelect(c.concept_id)}
              >
                <span className="text-lg">{c.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
        <ScrollBar className=" w-3" />
      </ScrollArea>
    </Card>
  );
}
