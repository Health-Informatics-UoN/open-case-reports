import ConceptsSection from "@/components/ConceptsSection";
import NotesSection from "@/components/NotesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DomainSelect from "@/components/DomainSelect";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    ids?: string | string[];
    domain?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const ids =
    typeof params.ids === "string" ? params.ids.split(",").filter(Boolean) : [];

  const domain =
    typeof params.domain === "string" && params.domain.length > 0
      ? params.domain
      : "All";

  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Open Case Reports</h1>
        <p className="text-muted-foreground">
          Browse common terms and find associated Case Reports
        </p>
      </div>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Filters</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium ">Domain</span>

            <DomainSelect domain={domain} />
          </div>
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-0 md:col-span-1">
          <ConceptsSection domain={domain} />
        </Card>

        <Card className="p-0 md:col-span-2">
          <NotesSection conceptIds={ids} page={page} />
        </Card>
      </div>
    </div>
  );
}
