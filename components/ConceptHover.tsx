"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export function ConceptHover({
  conceptName,
  relatedConcepts,
}: {
  conceptName: string;
  relatedConcepts?: { conceptId: string; conceptName: string }[];
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="flex items-center text-2xl cursor-pointer">
          {conceptName}
          <InfoCircledIcon className="ml-1" />
        </span>
      </HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="font-semibold">Related Concepts:</div>

          {relatedConcepts?.length ? (
            <div className="text-sm max-h-40 overflow-auto space-y-1">
              {relatedConcepts.map((c) => (
                <div key={c.conceptId} className="flex flex-col">
                  <span>{c.conceptName}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.conceptId}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No related concepts.
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
