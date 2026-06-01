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
    const params = new URLSearchParams(searchParams.toString());

    // Keep domain if it's not "All"
    if (domain && domain !== "All") {
      params.set("domain", domain);
    } else {
      params.delete("domain");
    }

    // Keep selected concepts
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

    if (ids.length > 0) {
      params.set("ids", ids.join(","));
    }

    // Reset page number
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
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
