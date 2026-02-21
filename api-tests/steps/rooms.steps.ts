import { expect } from "@playwright/test";
import { createBdd, DataTable } from "playwright-bdd";
import { test } from "../fixtures/api-fixtures";

const { Given, When, Then } = createBdd(test);

Given(
  "a room with ID {int} exists",
  async ({ apiClient, scenarioContext }, id: number) => {
    const { status } = await apiClient.getRoom(id);
    expect(status).toBe(200);
    scenarioContext.set("roomId", id);
  }
);

Given(
  "I have created a room with name {string}",
  async ({ apiClient, scenarioContext }, name: string) => {
    const { status, body } = await apiClient.createRoom({
      roomName: name,
      type: "Single",
      accessible: false,
      roomPrice: 100,
      description: "Test room for automation",
      image: "/images/room1.jpg",
      features: ["WiFi"],
    });
    expect(status).toBe(201);
    scenarioContext.set("createdRoomId", body.roomid);
    scenarioContext.set("lastResponseBody", body);
  }
);

When(
  "I request the list of all rooms",
  async ({ apiClient, scenarioContext }) => {
    const { status, body } = await apiClient.getRooms();
    scenarioContext.set("lastResponseStatus", status);
    scenarioContext.set("lastResponseBody", body);
  }
);

When(
  "I request room with ID {int}",
  async ({ apiClient, scenarioContext }, id: number) => {
    const { status, body } = await apiClient.getRoom(id);
    scenarioContext.set("lastResponseStatus", status);
    scenarioContext.set("lastResponseBody", body);
  }
);

When(
  "I create a room with the following details:",
  async ({ apiClient, scenarioContext }, dataTable: DataTable) => {
    const data = dataTable.hashes()[0];
    const { status, body } = await apiClient.createRoom({
      roomName: data.roomName,
      type: data.type as any,
      accessible: data.accessible === "true",
      roomPrice: parseInt(data.roomPrice),
      description: data.description,
      image: data.image,
      features: data.features.split(","),
    });
    scenarioContext.set("lastResponseStatus", status);
    scenarioContext.set("lastResponseBody", body);
    if (body?.roomid) {
      scenarioContext.set("createdRoomId", body.roomid);
    }
  }
);

When(
  "I update the room with the following details:",
  async ({ apiClient, scenarioContext }, dataTable: DataTable) => {
    const data = dataTable.hashes()[0];
    const roomId = scenarioContext.get("createdRoomId");
    const { status, body } = await apiClient.updateRoom(roomId, {
      roomName: data.roomName,
      type: data.type as any,
      accessible: data.accessible === "true",
      roomPrice: parseInt(data.roomPrice),
      description: data.description,
      image: data.image,
      features: data.features.split(","),
    });
    scenarioContext.set("lastResponseStatus", status);
    scenarioContext.set("lastResponseBody", body);
  }
);

When("I delete the created room", async ({ apiClient, scenarioContext }) => {
  const roomId = scenarioContext.get("createdRoomId");
  const status = await apiClient.deleteRoom(roomId);
  scenarioContext.set("lastResponseStatus", status);
});

Then(
  "the response should contain a list of rooms",
  async ({ scenarioContext }) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body).toHaveProperty("rooms");
    expect(Array.isArray(body.rooms)).toBeTruthy();
  }
);

Then(
  "the room response should contain a {string}",
  async ({ scenarioContext }, field: string) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body).toHaveProperty(field);
  }
);

Then(
  "the room response should contain roomName {string}",
  async ({ scenarioContext }, expected: string) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body.roomName).toBe(expected);
  }
);

Then(
  "the room response should contain type {string}",
  async ({ scenarioContext }, expected: string) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body.type).toBe(expected);
  }
);

Then(
  "the room response should contain roomPrice {int}",
  async ({ scenarioContext }, expected: number) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body.roomPrice).toBe(expected);
  }
);
