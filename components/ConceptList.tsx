import { Concept } from '@/types/OmopTables';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConceptList({
  concepts,
  onSelect
}: {
  concepts: Concept[];
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className='text-2xl'>Common Search Terms</CardTitle>
      </CardHeader>

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
    </Card>
  );
}