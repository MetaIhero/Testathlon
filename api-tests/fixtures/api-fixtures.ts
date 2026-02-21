import { test as base } from "playwright-bdd";
import { ApiClient } from "../support/api-client";

type ApiFixtures = {
  apiClient: ApiClient;
  scenarioContext: Map<string, any>;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },
  scenarioContext: async ({}, use) => {
    await use(new Map<string, any>());
  },
});
