"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function PaginationExample({
  currentPage,
  totalPages,
}: PaginationProps) {
  const searchParams = useSearchParams();

  // Helper untuk membuat URL dengan page & id (bahasa)
  const makeHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    // pastikan param id tetap ada
    if (!params.get("id")) params.set("id", "id-ID");
    return `/?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={makeHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {getPageNumbers().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={makeHref(page)}
              isActive={page === currentPage}
              className="pagination-link-custom"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage + 2 < totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={makeHref(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href={makeHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
