import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("should not render when totalPages is 1 or less", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={onPageChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render pagination controls", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByRole("navigation", { name: "Pagination navigation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to next page" })).toBeInTheDocument();
  });

  it("should call onPageChange when next button is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageChange when previous button is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const previousButton = screen.getByRole("button", { name: "Go to previous page" });
    await user.click(previousButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("should call onPageChange when page number is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const page3Button = screen.getByRole("button", { name: "Go to page 3" });
    await user.click(page3Button);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("should not call onPageChange when clicking current page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const page2Button = screen.getByRole("button", { name: "Go to page 2" });
    await user.click(page2Button);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should disable previous button on first page", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const previousButton = screen.getByRole("button", { name: "Go to previous page" });
    expect(previousButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    expect(nextButton).toBeDisabled();
  });

  it("should disable all buttons when disabled prop is true", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={true}
      />
    );

    const previousButton = screen.getByRole("button", { name: "Go to previous page" });
    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    const page2Button = screen.getByRole("button", { name: "Go to page 2" });

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(page2Button).toBeDisabled();
  });

  it("should highlight current page", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const currentPageButton = screen.getByRole("button", { name: "Go to page 3" });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  it("should show ellipsis for large page counts", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );

    const ellipsis = screen.getAllByText("...");
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it("should show all pages when totalPages is small", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("button", { name: `Go to page ${i}` })).toBeInTheDocument();
    }
  });

  it("should have proper accessibility attributes", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const nav = screen.getByRole("navigation", { name: "Pagination navigation" });
    expect(nav).toBeInTheDocument();

    const currentPageButton = screen.getByRole("button", { name: "Go to page 3" });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });
});

