"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchPageContent } from "@/components/SearchPageContent";

/**
 * Search results page with pagination component
 * Displays search results for the given query on the specified page
 * Redirects to /[search] if page is 1
 * @param params - Route parameters containing the search query and page number (Promise)
 */
export default function SearchPageWithPagination({
    params,
}: {
    params: Promise<{ search: string; page: string }>;
}) {
    const router = useRouter();

    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params);

    // Decode the search query from URL
    const searchQuery = decodeURIComponent(resolvedParams.search);

    // Parse and validate page number
    const page = parseInt(resolvedParams.page, 10);
    const validPage = isNaN(page) || page < 1 ? 1 : page;

    // Redirect to /[search] if page is 1 to maintain clean URLs
    useEffect(() => {
        if (validPage === 1) {
            router.replace(`/${encodeURIComponent(searchQuery)}`);
        }
    }, [validPage, searchQuery, router]);

    // If page is 1, don't render content (will redirect)
    if (validPage === 1) {
        return null;
    }

    return <SearchPageContent searchQuery={searchQuery} page={validPage} />;
}

