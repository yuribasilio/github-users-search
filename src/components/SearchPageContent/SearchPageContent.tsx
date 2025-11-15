"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { UserCard } from "@/components/UserCard";
import { UserModal } from "@/components/UserModal";
import { Pagination } from "@/components/Pagination";
import { useGitHubSearch } from "@/hooks/useGitHubSearch";
import { getUserDetails } from "@/services/github";
import type { GitHubUser } from "@/types/github";
import { UI_TEXTS } from "@/constants/ui-texts";

/**
 * Props for SearchPageContent component
 */
interface SearchPageContentProps {
    /**
     * Search query from URL params
     */
    searchQuery?: string;
    /**
     * Page number from URL params
     */
    page?: number;
}

/**
 * SearchPageContent component
 * Shared component for search functionality used in different routes
 */
export const SearchPageContent: React.FC<SearchPageContentProps> = ({
    searchQuery = "",
    page = 1,
}) => {
    const router = useRouter();
    const isInternalUpdate = useRef(false);

    const [initialQuery] = useState<string>(searchQuery);
    const [initialPage] = useState<number>(page);

    const {
        users,
        totalCount,
        currentPage,
        totalPages,
        isLoading,
        error,
        search,
        changePage,
        clearError,
    } = useGitHubSearch();

    const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);
    const [userDetails, setUserDetails] = useState<GitHubUser | null>(null);
    const hasInitialized = useRef(false);
    const lastSearchQuery = useRef<string>("");
    const lastPage = useRef<number>(1);

    // Sync search state with URL params (for browser navigation)
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        const query = searchQuery || "";
        const currentPageNum = page || 1;

        // On first mount, use initial values to avoid duplicate calls
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            if (initialQuery) {
                lastSearchQuery.current = initialQuery;
                lastPage.current = initialPage;
                search(initialQuery, initialPage);
                return;
            }
        }

        // Only update if search query or page actually changed
        if (
            query !== lastSearchQuery.current ||
            currentPageNum !== lastPage.current
        ) {
            lastSearchQuery.current = query;
            lastPage.current = currentPageNum;

            // Only update if URL changed externally (browser navigation)
            if (query) {
                search(query, currentPageNum);
            } else {
                search("", 1);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, page]);

    // Update URL when search or page changes
    const updateURL = (query: string, pageNum: number) => {
        isInternalUpdate.current = true;

        // Encode the search query for URL
        const encodedQuery = encodeURIComponent(query.trim());

        let newURL = "/";
        if (query.trim()) {
            if (pageNum > 1) {
                newURL = `/${encodedQuery}/${pageNum}`;
            } else {
                newURL = `/${encodedQuery}`;
            }
        }

        router.push(newURL, { scroll: false });
    };

    const handleSearch = async (query: string) => {
        updateURL(query, 1);
        await search(query, 1);
    };

    const handlePageChange = (pageNum: number) => {
        const currentQuery = searchQuery || "";
        updateURL(currentQuery, pageNum);
        changePage(pageNum);
    };

    const handleUserClick = async (user: GitHubUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setIsLoadingUserDetails(true);

        // Fetch detailed user information
        const { data, error: userError } = await getUserDetails(user.login);

        if (userError) {
            console.error("Error fetching user details:", userError);
            // Still show modal with basic info from search results
            setUserDetails(user);
        } else if (data) {
            setUserDetails(data);
        } else {
            setUserDetails(user);
        }

        setIsLoadingUserDetails(false);
    };

    const handleModalOpenChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            // Clear states when modal closes
            setSelectedUser(null);
            setUserDetails(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {UI_TEXTS.homePage.title}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {UI_TEXTS.homePage.description}
                    </p>
                </div>

                <div className="mb-6">
                    <SearchBar
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        initialValue={initialQuery}
                    />
                </div>

                {error && (
                    <div
                        className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
                        role="alert"
                    >
                        <div className="flex items-center justify-between">
                            <p>{error}</p>
                            <button
                                onClick={clearError}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                                aria-label={UI_TEXTS.homePage.dismissError}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {isLoading && users.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {UI_TEXTS.homePage.searchingUsers}
                            </p>
                        </div>
                    </div>
                )}

                {!isLoading && users.length === 0 && !error && (
                    <div className="py-12 text-center">
                        <p className="text-zinc-600 dark:text-zinc-400">
                            {UI_TEXTS.homePage.emptyState}
                        </p>
                    </div>
                )}

                {users.length > 0 && (
                    <>
                        <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                            {UI_TEXTS.homePage.foundUsers(totalCount)}
                            {totalPages > 1 &&
                                ` • ${UI_TEXTS.homePage.pageInfo(currentPage, totalPages)}`}
                        </div>

                        <div className="mb-8 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {users.map((user) => (
                                <UserCard key={user.id} user={user} onClick={handleUserClick} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mb-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    disabled={isLoading}
                                />
                            </div>
                        )}
                    </>
                )}

                <UserModal
                    user={userDetails || selectedUser}
                    open={isModalOpen}
                    onOpenChange={handleModalOpenChange}
                    isLoading={isLoadingUserDetails}
                />
            </main>
        </div>
    );
};

