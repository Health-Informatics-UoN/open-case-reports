"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "All") {
      params.delete("domain");
    } else {
      // Clear the conceptId if domain is changed
      params.delete("conceptId");
      params.set("domain", value);
    }
    router.push(`?${params.toString()}`);
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
