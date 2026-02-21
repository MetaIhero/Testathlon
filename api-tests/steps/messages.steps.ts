import { expect } from "@playwright/test";
import { createBdd, DataTable } from "playwright-bdd";
import { test } from "../fixtures/api-fixtures";

const { Given, When, Then } = createBdd(test);

Given(
  "I have sent a test message",
  async ({ apiClient, scenarioContext }) => {
    const { status, body } = await apiClient.createMessage({
      name: "AutoTest Sender",
      email: "autotest@example.com",
      phone: "01234567890",
      subject: "Automated test message",
      description:
        "This is an automated test message created for cleanup testing purposes.",
    });
    expect(status).toBe(201);
    scenarioContext.set("createdMessageId", body.messageid);
  }
);

When(
  "I send a message with the following details:",
  async ({ apiClient, scenarioContext }, dataTable: DataTable) => {
    const data = dataTable.hashes()[0];
    const { status, body } = await apiClient.createMessage({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      description: data.description,
    });
    scenarioContext.set("lastResponseStatus", status);
    scenarioContext.set("lastResponseBody", body);
    if (body?.messageid) {
      scenarioContext.set("createdMessageId", body.messageid);
    }
  }
);

When("I request all messages", async ({ apiClient, scenarioContext }) => {
  const { status, body } = await apiClient.getMessages();
  scenarioContext.set("lastResponseStatus", status);
  scenarioContext.set("lastResponseBody", body);
});

When(
  "I request the message count",
  async ({ apiClient, scenarioContext }) => {
    const { status, body } = await apiClient.getMessageCount();
    scenarioContext.set("lastResponseStatus", status);
    scenarioContext.set("lastResponseBody", body);
  }
);

When(
  "I delete the sent message",
  async ({ apiClient, scenarioContext }) => {
    const messageId = scenarioContext.get("createdMessageId");
    const status = await apiClient.deleteMessage(messageId);
    scenarioContext.set("lastResponseStatus", status);
  }
);

Then(
  "the response should contain a list of messages",
  async ({ scenarioContext }) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body).toHaveProperty("messages");
    expect(Array.isArray(body.messages)).toBeTruthy();
  }
);

Then(
  "the message response should contain name {string}",
  async ({ scenarioContext }, expected: string) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body.name).toBe(expected);
  }
);

Then(
  "the message response should contain subject {string}",
  async ({ scenarioContext }, expected: string) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body.subject).toBe(expected);
  }
);

Then(
  "the response should contain a count value",
  async ({ scenarioContext }) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body).toHaveProperty("count");
    expect(typeof body.count).toBe("number");
  }
);
