"use client";
import { useRouter, useSearchParams } from "next/navigation";
import type { Concept } from "@/types/OmopTables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ConceptList({ concepts }: { concepts: Concept[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSelect = (conceptId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("conceptId", conceptId);
    router.push(`/?${params.toString()}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Common Search Terms</CardTitle>
      </CardHeader>
      <ScrollArea className="h-400">
        <CardContent>
          <div className="space-y-2">
            {concepts.map((c) => (
              <Button
                key={c.concept_id}
                variant="ghost"
                className="w-full justify-between h-auto py-3 px-4"
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
