"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Concept } from "@/types/OmopTables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ConceptList({ concepts }: { concepts: Concept[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedConcepts = searchParams.getAll("conceptId");

  const onSelect = (conceptId: string) => {
    const currentParams = searchParams.getAll("conceptId");

    let nextConceptIds: string[];

    if (currentParams.includes(conceptId)) {
      nextConceptIds = currentParams.filter((id) => id !== conceptId);
    } else {
      nextConceptIds = [...currentParams, conceptId];
    }
    const params = new URLSearchParams();

    // Add conceptIds to Url
    nextConceptIds.forEach((id) => params.append("conceptId", id));

    // Add page number
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };
  const clearSelection = () => {
    router.replace(pathname);
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
                  selectedConcepts.includes(c.concept_id) ? "bg-indigo-50" : ""
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
