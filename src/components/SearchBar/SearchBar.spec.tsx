import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("should render search input and button", () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByLabelText("Search GitHub users")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit search" })).toBeInTheDocument();
  });

  it("should call onSearch when form is submitted", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText("Search GitHub users");
    const button = screen.getByRole("button", { name: "Submit search" });

    await user.type(input, "octocat");
    await user.click(button);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("octocat");
    });
  });

  it("should call onSearch when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText("Search GitHub users");
    await user.type(input, "octocat");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("octocat");
    });
  });

  it("should not call onSearch with empty query", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const button = screen.getByRole("button", { name: "Submit search" });
    await user.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should not call onSearch when query contains only whitespace", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText("Search GitHub users");
    await user.type(input, "   ");
    await user.keyboard("{Enter}");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should trim whitespace from query before submitting", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText("Search GitHub users");
    await user.type(input, "  octocat  ");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("octocat");
    });
  });

  it("should disable input and button when loading", () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={true} />);

    const input = screen.getByLabelText("Search GitHub users");
    const button = screen.getByRole("button", { name: "Submit search" });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Searching...");
  });

  it("should not call onSearch when loading", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={true} />);

    const input = screen.getByLabelText("Search GitHub users");
    const button = screen.getByRole("button", { name: "Submit search" });

    await user.type(input, "octocat");
    await user.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should not call onSearch when submitting form with Enter key while loading", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={true} />);

    const input = screen.getByLabelText("Search GitHub users");
    await user.type(input, "octocat");
    await user.keyboard("{Enter}");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should call onSearch with trimmed query when query has content and not loading", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByLabelText("Search GitHub users");
    await user.type(input, "  test-user  ");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("test-user");
    });
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("should use custom placeholder when provided", () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} placeholder="Custom placeholder" />);

    const input = screen.getByLabelText("Search GitHub users");
    expect(input).toHaveAttribute("placeholder", "Custom placeholder");
  });

  it("should have proper accessibility attributes", () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText("Search GitHub users");
    expect(input).toHaveAttribute("aria-label", "Search GitHub users");
    expect(input).toHaveAttribute("aria-busy", "false");
  });

  it("should show aria-busy when loading", () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={true} />);

    const input = screen.getByLabelText("Search GitHub users");
    expect(input).toHaveAttribute("aria-busy", "true");
  });
});

