"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useSearchParams, usePathname } from "next/navigation";

export default function NotesPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
    // Get conceptIds and add to URL
    if (ids.length > 0) {
      params.set("ids", ids.join(","));
    }

    // Add the page number
    params.set("page", String(newPage));

    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="pt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(page - 1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href={createPageURL(page + 1)}
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
