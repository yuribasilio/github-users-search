import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserCard } from "./UserCard";
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
  twitter_username: null,
  public_repos: 8,
  public_gists: 8,
  followers: 1000,
  following: 9,
  created_at: "2011-01-25T18:44:36Z",
  updated_at: "2023-01-25T18:44:36Z",
};

describe("UserCard", () => {
  it("should render user information", () => {
    const onClick = vi.fn();
    render(<UserCard user={mockUser} onClick={onClick} />);

    expect(screen.getByText("octocat")).toBeInTheDocument();
    expect(screen.getByText("The Octocat")).toBeInTheDocument();
    expect(screen.getByText("GitHub's mascot")).toBeInTheDocument();
    expect(screen.getByAltText("octocat avatar")).toBeInTheDocument();
  });

  it("should call onClick when card is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<UserCard user={mockUser} onClick={onClick} />);

    const card = screen.getByRole("button", { name: /View details for octocat/i });
    await user.click(card);

    expect(onClick).toHaveBeenCalledWith(mockUser);
  });

  it("should call onClick when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<UserCard user={mockUser} onClick={onClick} />);

    const card = screen.getByRole("button", { name: /View details for octocat/i });
    card.focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledWith(mockUser);
  });

  it("should call onClick when Space key is pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<UserCard user={mockUser} onClick={onClick} />);

    const card = screen.getByRole("button", { name: /View details for octocat/i });
    card.focus();
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledWith(mockUser);
  });

  it("should render without name when name is null", () => {
    const onClick = vi.fn();
    const userWithoutName = { ...mockUser, name: null };
    render(<UserCard user={userWithoutName} onClick={onClick} />);

    expect(screen.getByText("octocat")).toBeInTheDocument();
    expect(screen.queryByText("The Octocat")).not.toBeInTheDocument();
  });

  it("should render without bio when bio is null", () => {
    const onClick = vi.fn();
    const userWithoutBio = { ...mockUser, bio: null };
    render(<UserCard user={userWithoutBio} onClick={onClick} />);

    expect(screen.getByText("octocat")).toBeInTheDocument();
    expect(screen.queryByText("GitHub's mascot")).not.toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    const onClick = vi.fn();
    render(<UserCard user={mockUser} onClick={onClick} />);

    const card = screen.getByRole("button", { name: /View details for octocat/i });
    expect(card).toHaveAttribute("tabIndex", "0");
    expect(card).toHaveAttribute("aria-label", "View details for octocat");
  });

  it("should truncate long usernames", () => {
    const onClick = vi.fn();
    const userWithLongName = {
      ...mockUser,
      login: "very-long-username-that-should-be-truncated",
    };
    render(<UserCard user={userWithLongName} onClick={onClick} />);

    expect(screen.getByText("very-long-username-that-should-be-truncated")).toBeInTheDocument();
  });
});

