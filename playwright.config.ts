import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import "dotenv/config";

const testDir = defineBddConfig({
  features: "api-tests/features/**/*.feature",
  steps: "api-tests/steps/**/*.ts",
  importTestFrom: "api-tests/fixtures/api-fixtures.ts",
});

export default defineConfig({
  timeout: 30_000,
  retries: 1,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    // Existing UI test projects
    {
      name: "chromium",
      testDir: "./tests",
      use: { ...devices["Desktop Chrome"], headless: true },
    },
    {
      name: "firefox",
      testDir: "./tests",
      use: { ...devices["Desktop Firefox"], headless: true },
    },

    // BDD API tests (no browser needed)
    {
      name: "api-bdd",
      testDir,
    },
  ],
});
