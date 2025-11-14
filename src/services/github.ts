import type { GitHubUser, GitHubSearchResponse, GitHubError } from "@/types/github";
import { UI_TEXTS } from "@/constants/ui-texts";

const GITHUB_API_BASE_URL =
  process.env.NEXT_PUBLIC_GITHUB_API_BASE_URL || "https://api.github.com";
const RESULTS_PER_PAGE = Number(
  process.env.NEXT_PUBLIC_GITHUB_RESULTS_PER_PAGE || "20"
);

/**
 * Fetches users from GitHub API based on search query
 * @param query - Search query string
 * @param page - Page number (1-indexed)
 * @returns Promise with search response or error
 */
export async function searchUsers(
  query: string,
  page: number = 1
): Promise<{ data: GitHubSearchResponse | null; error: GitHubError | null }> {
  if (!query.trim()) {
    return {
      data: null,
      error: { message: UI_TEXTS.errors.searchQueryEmpty },
    };
  }

  try {
    const perPage = RESULTS_PER_PAGE;
    const url = `${GITHUB_API_BASE_URL}/search/users?q=${encodeURIComponent(
      query
    )}&per_page=${perPage}&page=${page}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return {
          data: null,
          error: {
            message: UI_TEXTS.errors.rateLimitExceeded,
            documentation_url:
              "https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting",
          },
        };
      }

      const errorData: GitHubError = await response.json().catch(() => ({
        message: UI_TEXTS.errors.httpError(response.status),
      }));

      return { data: null, error: errorData };
    }

    const data: GitHubSearchResponse = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : UI_TEXTS.errors.unknownError,
      },
    };
  }
}

/**
 * Fetches detailed user information from GitHub API
 * @param username - GitHub username
 * @returns Promise with user data or error
 */
export async function getUserDetails(
  username: string
): Promise<{ data: GitHubUser | null; error: GitHubError | null }> {
  if (!username.trim()) {
    return {
      data: null,
      error: { message: UI_TEXTS.errors.usernameEmpty },
    };
  }

  try {
    const url = `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(username)}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return {
          data: null,
          error: {
            message: UI_TEXTS.errors.rateLimitExceeded,
            documentation_url:
              "https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting",
          },
        };
      }

      if (response.status === 404) {
        return {
          data: null,
          error: {
            message: UI_TEXTS.errors.userNotFound,
          },
        };
      }

      const errorData: GitHubError = await response.json().catch(() => ({
        message: UI_TEXTS.errors.httpError(response.status),
      }));

      return { data: null, error: errorData };
    }

    const data: GitHubUser = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : UI_TEXTS.errors.unknownError,
      },
    };
  }
}

/**
 * Calculates total number of pages based on total count and results per page
 * @param totalCount - Total number of results
 * @returns Total number of pages
 */
export function calculateTotalPages(totalCount: number): number {
  return Math.ceil(totalCount / RESULTS_PER_PAGE);
}

