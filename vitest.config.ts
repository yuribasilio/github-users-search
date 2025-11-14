import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/tests/setup-tests.ts",
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        coverage: {
            exclude: [
                "src/constants/ui-texts.ts",
            ],
        },
    },
});
