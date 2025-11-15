"use client";

import { use } from "react";
import { SearchPageContent } from "@/components/SearchPageContent";

/**
 * Search results page component
 * Displays search results for the given query on page 1
 * @param params - Route parameters containing the search query (Promise)
 */
export default function SearchPage({
  params,
}: {
  params: Promise<{ search: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  
  // Decode the search query from URL
  const searchQuery = decodeURIComponent(resolvedParams.search);
  const page = 1;

  return <SearchPageContent searchQuery={searchQuery} page={page} />;
}

