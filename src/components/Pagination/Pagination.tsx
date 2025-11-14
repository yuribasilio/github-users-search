"use client";

/**
 * Props for Pagination component
 */
export interface PaginationProps {
  /**
   * Current page number (1-indexed)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Callback function called when page changes
   * @param page - The new page number (1-indexed)
   */
  onPageChange: (page: number) => void;
  /**
   * Whether pagination is disabled (e.g., during loading)
   */
  disabled?: boolean;
}

/**
 * Pagination component for navigating through pages of results
 * Displays page numbers and navigation buttons with proper accessibility
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  const getPageNumbers = (): (number | string)[] => {
    const MAX_VISIBLE = 7;
    const EDGE_PAGES = 3; // Pages to show at the start/end
    const AROUND_CURRENT = 1; // Pages to show around current page

    // Show all pages if total is small enough
    if (totalPages <= MAX_VISIBLE) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];
    const isNearStart = currentPage <= EDGE_PAGES;
    const isNearEnd = currentPage >= totalPages - 2;

    if (isNearStart) {
      // Show: 1, 2, 3, 4, 5, ..., last
      pages.push(...Array.from({ length: 4 }, (_, i) => i + 2));
      pages.push("ellipsis", totalPages);
    } else if (isNearEnd) {
      // Show: 1, ..., last-4, last-3, last-2, last-1, last
      pages.push("ellipsis");
      pages.push(...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i));
    } else {
      // Show: 1, ..., current-1, current, current+1, ..., last
      pages.push("ellipsis");
      pages.push(...Array.from({ length: 3 }, (_, i) => currentPage - AROUND_CURRENT + i));
      pages.push("ellipsis", totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination navigation"
    >
      <button
        onClick={handlePrevious}
        disabled={disabled || currentPage === 1}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600"
        aria-label="Go to previous page"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-zinc-500 dark:text-zinc-400"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              disabled={disabled}
              className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed ${isCurrentPage
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                } ${disabled && !isCurrentPage ? "disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600" : ""}`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={disabled || currentPage === totalPages}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600"
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
};

