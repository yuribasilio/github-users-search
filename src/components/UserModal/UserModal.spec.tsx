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

  it("should show skeleton loading state when isLoading is true", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={true} />
    );

    // Check for skeleton elements (they have aria-hidden="true")
    const skeletons = document.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should display user statistics", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    expect(screen.getByText("1,000")).toBeInTheDocument(); // followers
    expect(screen.getByText("9")).toBeInTheDocument(); // following
    const eights = screen.getAllByText("8"); // repos and gists
    expect(eights.length).toBeGreaterThanOrEqual(2);
  });

  it("should display user location and company", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    expect(screen.getByText("San Francisco")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("should have link to GitHub profile", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    const githubLink = screen.getByRole("link", { name: "View on GitHub" });
    expect(githubLink).toHaveAttribute("href", "https://github.com/octocat");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should call onOpenChange when close button is clicked", async () => {
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
  });

  it("should format dates correctly", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    // The date should be formatted as a readable string
    const memberSince = screen.getByText(/Member Since/i).nextSibling;
    expect(memberSince).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    const onOpenChange = vi.fn();
    render(
      <UserModal user={mockUser} open={true} onOpenChange={onOpenChange} isLoading={false} />
    );

    const title = screen.getByRole("heading", { name: "octocat" });
    expect(title).toBeInTheDocument();
  });
});

