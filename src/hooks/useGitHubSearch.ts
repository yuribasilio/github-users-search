import { useState, useCallback } from "react";
import { searchUsers, calculateTotalPages } from "@/services/github";
import type { GitHubUser } from "@/types/github";
import { UI_TEXTS } from "@/constants/ui-texts";

interface UseGitHubSearchReturn {
  users: GitHubUser[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  search: (query: string, page?: number) => Promise<void>;
  changePage: (page: number) => void;
  clearError: () => void;
}

/**
 * Custom hook for managing GitHub user search
 * Handles search state, pagination, and error management
 */
export function useGitHubSearch(): UseGitHubSearchReturn {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");

  const search = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setUsers([]);
      setTotalCount(0);
      setTotalPages(0);
      setCurrentPage(1);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);

    try {
      const { data, error: searchError } = await searchUsers(query, page);

      if (searchError) {
        setError(searchError.message);
        setUsers([]);
        setTotalCount(0);
        setTotalPages(0);
        return;
      }

      if (data) {
        setUsers(data.items);
        setTotalCount(data.total_count);
        const pages = calculateTotalPages(data.total_count);
        setTotalPages(pages);
        setCurrentPage(page);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : UI_TEXTS.errors.unknownError
      );
      setUsers([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePage = useCallback(
    (page: number) => {
      if (currentQuery && page >= 1 && page <= totalPages && page !== currentPage) {
        search(currentQuery, page);
      }
    },
    [currentQuery, totalPages, currentPage, search]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    users,
    totalCount,
    currentPage,
    totalPages,
    isLoading,
    error,
    search,
    changePage,
    clearError,
  };
}

