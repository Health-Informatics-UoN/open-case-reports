import { Suspense } from "react";
import { use } from "react";
import ConceptsSection from "@/components/ConceptsSection";
import NotesSection from "@/components/NotesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DomainSelect from "@/components/DomainSelect";

export default function Page(props: {
  searchParams: Promise<{
    conceptId?: string;
    domain?: string;
  }>;
}) {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <PageContent {...props} />
    </Suspense>
  );
}

function PageContent({
  searchParams,
}: {
  searchParams: Promise<{
    conceptId?: string | string[];
    domain?: string;
  }>;
}) {
  const params = use(searchParams);

  const conceptIds = Array.isArray(params.conceptId)
    ? params.conceptId
    : params.conceptId
      ? [params.conceptId]
      : [];
  const domain = params.domain ?? "All";

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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-0 md:col-span-1">
          <Suspense fallback={<div>Loading concepts...</div>}>
            <ConceptsSection domain={domain} />
          </Suspense>
        </Card>

        <Card className="p-0 md:col-span-2">
          <Suspense fallback={<div>Loading notes...</div>}>
            <NotesSection conceptIds={conceptIds} />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
