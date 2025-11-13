import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    // Remove Next.js specific props that don't work with regular img
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, sizes, ...imgProps } = props;
    return React.createElement("img", imgProps);
  },
}));
