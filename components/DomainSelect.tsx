"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DomainSelect({ domain }: { domain: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function handleChange(domain: string) {
    const params = new URLSearchParams();

    // Keep domain if exists
    if (domain && domain !== "All") {
      params.set("domain", domain);
    }

    // Keep selected concepts
    const conceptIds = searchParams.getAll("conceptId");
    conceptIds.forEach((id) => params.append("conceptId", id));

    // Reset page number
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  }
  return (
    <Select value={domain} onValueChange={handleChange}>
      <SelectTrigger className="w-50">
        <SelectValue placeholder="Select domain" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        <SelectItem value="Condition">Condition</SelectItem>
        <SelectItem value="Drug">Drug</SelectItem>
        <SelectItem value="Procedure">Procedure</SelectItem>
        <SelectItem value="Measurement">Measurement</SelectItem>
      </SelectContent>
    </Select>
  );
}
