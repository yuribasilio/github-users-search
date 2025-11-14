import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("should call onPageChange with currentPage + 1 when currentPage < totalPages and !disabled", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={false}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(4);
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

  it("should call onPageChange with currentPage - 1 when currentPage > 1 and !disabled", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={false}
      />
    );

    const previousButton = screen.getByRole("button", { name: "Go to previous page" });
    fireEvent.click(previousButton);

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
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

  it("should show all pages when totalPages is 7 or less", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={7}
        onPageChange={onPageChange}
      />
    );

    for (let i = 1; i <= 7; i++) {
      expect(screen.getByRole("button", { name: `Go to page ${i}` })).toBeInTheDocument();
    }

    const ellipsis = screen.queryAllByText("...");
    expect(ellipsis).toHaveLength(0);
  });

  it("should show ellipsis when totalPages is greater than 7", () => {
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

  describe("when near start (currentPage <= 3)", () => {
    it("should show first 5 pages, ellipsis, and last page", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={2}
          totalPages={10}
          onPageChange={onPageChange}
        />
      );

      // Should show: 1, 2, 3, 4, 5, ..., 10
      expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 2" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 3" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 4" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 5" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument();

      const ellipsis = screen.getAllByText("...");
      expect(ellipsis).toHaveLength(1);

      // Should not show pages 6-9
      expect(screen.queryByRole("button", { name: "Go to page 6" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 7" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 8" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 9" })).not.toBeInTheDocument();
    });
  });

  describe("when near end (currentPage >= totalPages - 2)", () => {
    it("should show first page, ellipsis, and last 5 pages", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          onPageChange={onPageChange}
        />
      );

      // Should show: 1, ..., 6, 7, 8, 9, 10
      expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 6" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 7" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 8" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 9" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument();

      const ellipsis = screen.getAllByText("...");
      expect(ellipsis).toHaveLength(1);

      // Should not show pages 2-5
      expect(screen.queryByRole("button", { name: "Go to page 2" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 3" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 4" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 5" })).not.toBeInTheDocument();
    });
  });

  describe("when in the middle", () => {
    it("should show first page, ellipsis, current-1, current, current+1, ellipsis, and last page", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={onPageChange}
        />
      );

      // Should show: 1, ..., 4, 5, 6, ..., 10
      expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 4" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 5" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 6" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument();

      const ellipsis = screen.getAllByText("...");
      expect(ellipsis).toHaveLength(2);

      // Should not show pages 2-3 and 7-9
      expect(screen.queryByRole("button", { name: "Go to page 2" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 3" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 7" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 8" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to page 9" })).not.toBeInTheDocument();
    });
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

  it("should not call onPageChange when disabled and clicking buttons", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={true}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    const previousButton = screen.getByRole("button", { name: "Go to previous page" });
    const page2Button = screen.getByRole("button", { name: "Go to page 2" });

    await user.click(nextButton);
    await user.click(previousButton);
    await user.click(page2Button);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not call onPageChange when disabled and currentPage > 1 and clicking previous", async () => {
    const user = userEvent.setup();
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
    await user.click(previousButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not call onPageChange when disabled and currentPage < totalPages and clicking next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={true}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    await user.click(nextButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not call onPageChange when currentPage is 1 and clicking previous (even with fireEvent)", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const previousButton = screen.getByRole("button", { name: "Go to previous page" });
    // Use fireEvent to trigger onClick even on disabled button to test the condition
    fireEvent.click(previousButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not call onPageChange when currentPage equals totalPages and clicking next (even with fireEvent)", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    // Use fireEvent to trigger onClick even on disabled button to test the condition
    fireEvent.click(nextButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not call onPageChange when disabled is true and clicking previous (even with fireEvent)", () => {
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
    // Use fireEvent to trigger onClick even on disabled button to test the condition
    fireEvent.click(previousButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not call onPageChange when disabled is true and clicking next (even with fireEvent)", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={true}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    // Use fireEvent to trigger onClick even on disabled button to test the condition
    fireEvent.click(nextButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });
});

