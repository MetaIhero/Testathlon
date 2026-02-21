import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { test } from "../fixtures/api-fixtures";

const { Given, Then } = createBdd(test);

Given("the API is accessible", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBeLessThan(500);
});

Given("I am logged in as admin", async ({ apiClient, scenarioContext }) => {
  const token = await apiClient.login({
    username: "admin",
    password: "password",
  });
  expect(token).toBeTruthy();
  scenarioContext.set("token", token);
});

Given("I am not authenticated", async ({ apiClient }) => {
  apiClient.clearToken();
});

Then(
  "the response status should be {int}",
  async ({ scenarioContext }, status: number) => {
    const actualStatus = scenarioContext.get("lastResponseStatus");
    expect(actualStatus).toBe(status);
  }
);
