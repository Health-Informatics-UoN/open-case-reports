import ConceptList from "./ConceptList";
import { getConcepts } from "@/lib/services/conceptsService";
import type { Concept } from "@/types/OmopTables";

export default async function ConceptsSection({ domain }: { domain: string }) {
  const concepts: Concept[] = await getConcepts(domain);

  return <ConceptList concepts={concepts} />;
}
