"use client";

import { useState, FormEvent } from "react";
import { UI_TEXTS } from "@/constants/ui-texts";

/**
 * Props for SearchBar component
 */
export interface SearchBarProps {
  /**
   * Callback function called when search is submitted
   * @param query - The search query string
   */
  onSearch: (query: string) => void;
  /**
   * Whether the search is currently loading
   */
  isLoading?: boolean;
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
}

/**
 * SearchBar component for searching GitHub users
 * Provides an accessible search input with submit functionality
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
  placeholder = UI_TEXTS.searchBar.placeholder,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="flex gap-2">
        <label htmlFor="search-input" className="sr-only">
          {UI_TEXTS.searchBar.label}
        </label>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-blue-400 dark:disabled:bg-zinc-900"
          aria-label={UI_TEXTS.searchBar.ariaLabel}
          aria-busy={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
          aria-label={UI_TEXTS.searchBar.submitButtonAriaLabel}
        >
          {isLoading
            ? UI_TEXTS.searchBar.submitButtonLoading
            : UI_TEXTS.searchBar.submitButton}
        </button>
      </div>
    </form>
  );
};

