import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@autofocus/domain": new URL("./packages/domain/src/index.ts", import.meta.url).pathname
    }
  }
});
