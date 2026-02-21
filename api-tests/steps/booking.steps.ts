import { expect } from "@playwright/test";
import { createBdd, DataTable } from "playwright-bdd";
import { test } from "../fixtures/api-fixtures";

const { Given, When, Then } = createBdd(test);

Given(
  "I have created a booking for room {int}",
  async ({ apiClient, scenarioContext }, roomId: number) => {
    const { status, body } = await apiClient.createBooking({
      roomid: roomId,
      firstname: "AutoTest",
      lastname: "Cleanup",
      depositpaid: true,
      bookingdates: {
        checkin: "2026-09-01",
        checkout: "2026-09-03",
      },
      email: "autotest@example.com",
      phone: "01234567890",
    });
    expect(status).toBe(201);
    scenarioContext.set("createdBookingId", body.bookingid);
  }
);

When(
  "I create a booking with the following details:",
  async ({ apiClient, scenarioContext }, dataTable: DataTable) => {
    const data = dataTable.hashes()[0];
    const booking: any = {
      roomid: parseInt(data.roomid),
      firstname: data.firstname,
      lastname: data.lastname,
      depositpaid: data.depositpaid === "true",
      bookingdates: {
        checkin: data.checkin,
        checkout: data.checkout,
      },
    };
    if (data.email) booking.email = data.email;
    if (data.phone) booking.phone = data.phone;

    const { status, body } = await apiClient.createBooking(booking);
    scenarioContext.set("lastResponseStatus", status);
    scenarioContext.set("lastResponseBody", body);
    if (body?.bookingid) {
      scenarioContext.set("createdBookingId", body.bookingid);
    }
  }
);

When(
  "I request bookings for room ID {int}",
  async ({ apiClient, scenarioContext }, roomId: number) => {
    const { status, body } = await apiClient.getBookings(roomId);
    scenarioContext.set("lastResponseStatus", status);
    scenarioContext.set("lastResponseBody", body);
  }
);

When(
  "I request the booking summary for room ID {int}",
  async ({ request, scenarioContext }, roomId: number) => {
    const response = await request.get(
      `/booking/summary?roomid=${roomId}`
    );
    scenarioContext.set("lastResponseStatus", response.status());
    try {
      scenarioContext.set("lastResponseBody", await response.json());
    } catch {
      // summary may return empty
    }
  }
);

When(
  "I delete the created booking",
  async ({ apiClient, scenarioContext }) => {
    const bookingId = scenarioContext.get("createdBookingId");
    const status = await apiClient.deleteBooking(bookingId);
    scenarioContext.set("lastResponseStatus", status);
  }
);

Then(
  "the response should contain a list of bookings",
  async ({ scenarioContext }) => {
    const body = scenarioContext.get("lastResponseBody");
    expect(body).toHaveProperty("bookings");
    expect(Array.isArray(body.bookings)).toBeTruthy();
  }
);

Then(
  "the booking response should contain firstname {string}",
  async ({ scenarioContext }, expected: string) => {
    const body = scenarioContext.get("lastResponseBody");
    const booking = body.booking || body;
    expect(booking.firstname).toBe(expected);
  }
);

Then(
  "the booking response should contain lastname {string}",
  async ({ scenarioContext }, expected: string) => {
    const body = scenarioContext.get("lastResponseBody");
    const booking = body.booking || body;
    expect(booking.lastname).toBe(expected);
  }
);
