import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserModal } from "./UserModal";
import type { GitHubUser } from "@/types/github";

const mockUser: GitHubUser = {
  login: "octocat",
  id: 1,
  node_id: "MDQ6VXNlcjE=",
  avatar_url: "https://github.com/images/error/octocat_happy.gif",
  gravatar_id: null,
  url: "https://api.github.com/users/octocat",
  html_url: "https://github.com/octocat",
  followers_url: "https://api.github.com/users/octocat/followers",
  following_url: "https://api.github.com/users/octocat/following{/other_user}",
  gists_url: "https://api.github.com/users/octocat/gists{/gist_id}",
  starred_url: "https://api.github.com/users/octocat/starred{/owner}{/repo}",
  subscriptions_url: "https://api.github.com/users/octocat/subscriptions",
  organizations_url: "https://api.github.com/users/octocat/orgs",
  repos_url: "https://api.github.com/users/octocat/repos",
  events_url: "https://api.github.com/users/octocat/events{/privacy}",
  received_events_url: "https://api.github.com/users/octocat/received_events",
  type: "User",
  site_admin: false,
  name: "The Octocat",
  company: "GitHub",
  blog: "https://github.com/blog",
  location: "San Francisco",
  email: "octocat@github.com",
  hireable: null,
  bio: "GitHub's mascot",
  twitter_username: "octocat",
  public_repos: 8,
  public_gists: 8,
  followers: 1000,
  following: 9,
  created_at: "2011-01-25T18:44:36Z",
  updated_at: "2023-01-25T18:44:36Z",
};

describe("UserModal", () => {
  it("should not render when user is null", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <UserModal user={null} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render user information when open", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    expect(screen.getByText("octocat")).toBeInTheDocument();
    expect(screen.getByText("The Octocat")).toBeInTheDocument();
    expect(screen.getByText("GitHub's mascot")).toBeInTheDocument();
  });

  it("should render user avatar image with correct attributes", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    const avatar = screen.getByAltText("octocat avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", mockUser.avatar_url);
  });

  it("should show skeleton loading state when isLoading is true", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={true} />
    );

    // Check for skeleton elements (they have aria-hidden="true")
    const skeletons = document.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(0);

    // User information should not be visible when loading
    expect(screen.queryByText("octocat")).not.toBeInTheDocument();
    expect(screen.queryByText("The Octocat")).not.toBeInTheDocument();
    expect(screen.queryByText("GitHub's mascot")).not.toBeInTheDocument();

    // Loading message should be present but visually hidden
    const loadingMessage = screen.getByText(/Loading user details/i);
    expect(loadingMessage).toBeInTheDocument();
    expect(loadingMessage).toHaveClass("sr-only");
  });

  it("should display user statistics with formatted numbers", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    expect(screen.getByText("1,000")).toBeInTheDocument(); // followers
    expect(screen.getByText("9")).toBeInTheDocument(); // following
    const eights = screen.getAllByText("8"); // repos and gists
    expect(eights.length).toBeGreaterThanOrEqual(2);
  });

  it("should format numbers as 0 when they are null or undefined", () => {
    const onOpenChange = vi.fn();
    const userWithNullNumbers = {
      ...mockUser,
      followers: null as unknown as number,
      following: undefined as unknown as number,
      public_repos: null as unknown as number,
      public_gists: undefined as unknown as number,
    };
    render(
      <UserModal
        user={userWithNullNumbers}
        open={true}
        onOpenChange={onOpenChange}
        isLoading={false}
      />
    );

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(4);
  });

  it("should display user location and company", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    expect(screen.getByText("San Francisco")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("should display blog link with correct attributes", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    const blogLink = screen.getByText("https://github.com/blog");
    expect(blogLink).toBeInTheDocument();
    expect(blogLink).toHaveAttribute("href", "https://github.com/blog");
    expect(blogLink).toHaveAttribute("target", "_blank");
    expect(blogLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should display Twitter link with correct attributes", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    const twitterLink = screen.getByText("@octocat");
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute("href", "https://twitter.com/octocat");
    expect(twitterLink).toHaveAttribute("target", "_blank");
    expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should have link to GitHub profile with correct attributes", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    const githubLink = screen.getByRole("link", { name: "View on GitHub" });
    expect(githubLink).toHaveAttribute("href", "https://github.com/octocat");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should call onOpenChange when close button (X) is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    const closeButton = screen.getByLabelText("Close dialog");
    await user.click(closeButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("should call onOpenChange when Close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("should render without optional fields when they are null", () => {
    const onOpenChange = vi.fn();
    const userWithoutOptional = {
      ...mockUser,
      name: null,
      bio: null,
      location: null,
      company: null,
      blog: null,
      twitter_username: null,
    };
    render(
      <UserModal
        user={userWithoutOptional}
        open={true}
        onOpenChange={onOpenChange}
        isLoading={false}
      />
    );

    expect(screen.getByText("octocat")).toBeInTheDocument();
    expect(screen.queryByText("The Octocat")).not.toBeInTheDocument();
    expect(screen.queryByText("GitHub's mascot")).not.toBeInTheDocument();
    expect(screen.queryByText("San Francisco")).not.toBeInTheDocument();
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(screen.queryByText("https://github.com/blog")).not.toBeInTheDocument();
    expect(screen.queryByText("@octocat")).not.toBeInTheDocument();
  });

  it("should format dates correctly", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    // The date should be formatted as a readable string (e.g., "January 25, 2011")
    const memberSinceLabel = screen.getByText(/Member Since/i);
    expect(memberSinceLabel).toBeInTheDocument();

    // Check that the formatted date is present (should contain month name and year)
    const dateText = memberSinceLabel.parentElement?.textContent || "";
    // Check for month name (in English locale)
    expect(dateText).toMatch(/January|February|March|April|May|June|July|August|September|October|November|December/);
    // Check for the year
    expect(dateText).toMatch(/2011/);
    // Check that it's not just the raw ISO string
    expect(dateText).not.toMatch(/2011-01-25/);
  });

  it("should format empty date string as empty", () => {
    const onOpenChange = vi.fn();
    const userWithEmptyDate = {
      ...mockUser,
      created_at: "",
    };
    render(
      <UserModal
        user={userWithEmptyDate}
        open={true}
        onOpenChange={onOpenChange}
        isLoading={false}
      />
    );

    const memberSinceLabel = screen.getByText(/Member Since/i);
    const dateText = memberSinceLabel.parentElement?.textContent || "";
    // Should only contain the label, not a date
    expect(dateText.trim()).toBe("Member Since");
  });

  it("should have proper accessibility attributes", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    // Check for dialog title
    const title = screen.getByRole("heading", { name: "octocat" });
    expect(title).toBeInTheDocument();

    // Check for dialog description (sr-only class makes it visually hidden but accessible)
    const description = screen.getByText(/Detailed information about GitHub user octocat/i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("sr-only");

    // Check for close button accessibility
    const closeButton = screen.getByLabelText("Close dialog");
    expect(closeButton).toBeInTheDocument();
  });

  it("should display all required statistics labels", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("Following")).toBeInTheDocument();
    expect(screen.getByText("Public Repos")).toBeInTheDocument();
    expect(screen.getByText("Public Gists")).toBeInTheDocument();
    expect(screen.getByText("Member Since")).toBeInTheDocument();
  });
});

