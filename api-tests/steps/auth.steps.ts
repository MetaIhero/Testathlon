import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { test } from "../fixtures/api-fixtures";

const { When, Then } = createBdd(test);

When(
  "I login with username {string} and password {string}",
  async ({ request, scenarioContext }, username: string, password: string) => {
    const response = await request.post("/auth/login", {
      data: { username, password },
    });
    scenarioContext.set("lastResponseStatus", response.status());
    scenarioContext.set("lastResponseHeaders", response.headers());
    try {
      scenarioContext.set("lastResponseBody", await response.json());
    } catch {
      // Some error responses may not be JSON
    }
    const cookies = response.headers()["set-cookie"] || "";
    const match = cookies.match(/token=([^;]+)/);
    if (match) {
      scenarioContext.set("authToken", match[1]);
    }
  }
);

Then("I should receive a valid auth token", async ({ scenarioContext }) => {
  const token = scenarioContext.get("authToken");
  expect(token).toBeTruthy();
  expect(token.length).toBeGreaterThan(0);
});

When("I validate my auth token", async ({ apiClient, scenarioContext }) => {
  const token = apiClient.getToken();
  expect(token).toBeTruthy();
  const status = await apiClient.validate(token!);
  scenarioContext.set("lastResponseStatus", status);
});

When(
  "I validate token {string}",
  async ({ apiClient, scenarioContext }, token: string) => {
    const status = await apiClient.validate(token);
    scenarioContext.set("lastResponseStatus", status);
  }
);
