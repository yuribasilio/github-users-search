/**
 * UI Texts Constants
 * Centralized location for all user-facing text content and placeholders
 * This makes it easier to maintain and update text content across the application
 */

export const UI_TEXTS = {
    // SearchBar Component
    searchBar: {
        placeholder: "Search GitHub users...",
        label: "Search GitHub users",
        ariaLabel: "Search GitHub users",
        submitButton: "Search",
        submitButtonLoading: "Searching...",
        submitButtonAriaLabel: "Submit search",
    },

    // UserModal Component
    userModal: {
        description: (username: string) =>
            `Detailed information about GitHub user ${username}`,
        loadingUserDetails: "Loading user details",
        closeDialog: "Close dialog",
        closeButton: "Close",
        viewOnGitHub: "View on GitHub",
        fields: {
            location: "Location",
            company: "Company",
            website: "Website",
            twitter: "Twitter",
            followers: "Followers",
            following: "Following",
            publicRepos: "Public Repos",
            publicGists: "Public Gists",
            memberSince: "Member Since",
        },
    },

    // Pagination Component
    pagination: {
        ariaLabel: "Pagination navigation",
        previousButton: "Previous",
        previousAriaLabel: "Go to previous page",
        nextButton: "Next",
        nextAriaLabel: "Go to next page",
        pageAriaLabel: (pageNumber: number) => `Go to page ${pageNumber}`,
        ellipsis: "...",
    },

    // Home Page
    homePage: {
        title: "GitHub Users Search",
        description: "Search for GitHub users and explore their profiles",
        searchingUsers: "Searching users...",
        emptyState: "Enter a search query to find GitHub users",
        foundUsers: (count: number) => {
            const plural = count !== 1 ? "s" : "";
            return `Found ${count.toLocaleString()} user${plural}`;
        },
        pageInfo: (currentPage: number, totalPages: number) =>
            `Page ${currentPage} of ${totalPages}`,
        dismissError: "Dismiss error",
    },

    // UserCard Component
    userCard: {
        viewDetailsAriaLabel: (username: string) =>
            `View details for ${username}`,
        avatarAlt: (username: string) => `${username} avatar`,
    },

    // Layout Metadata
    metadata: {
        title: "GitHub Users Search",
        description:
            "Search and explore GitHub users with detailed profile information",
    },

    // Error Messages (from services)
    errors: {
        searchQueryEmpty: "Search query cannot be empty",
        usernameEmpty: "Username cannot be empty",
        rateLimitExceeded: "Rate limit exceeded. Please try again later.",
        userNotFound: "User not found",
        httpError: (status: number) => `HTTP error! status: ${status}`,
        unknownError: "An unknown error occurred",
    },
} as const;

