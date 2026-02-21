import { Page, Locator } from "@playwright/test";

export class RoomDetailPage {
  readonly page: Page;
  readonly roomTitle: Locator;
  readonly pricePerNight: Locator;
  readonly reserveNowButton: Locator;
  readonly cancelButton: Locator;
  readonly firstnameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly totalPrice: Locator;
  readonly priceSummarySection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomTitle = page.locator("h1, h2").first();
    this.pricePerNight = page.locator("text=/£\d+\s*per night/").first();
    this.reserveNowButton = page.getByRole("button", { name: "Reserve Now" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.firstnameInput = page.locator('input[placeholder="Firstname"]');
    this.lastnameInput = page.locator('input[placeholder="Lastname"]');
    this.emailInput = page.locator('input[placeholder="Email"]');
    this.phoneInput = page.locator('input[placeholder="Phone"]');
    this.totalPrice = page
      .locator("text=/Total/")
      .locator("..")
      .locator("text=/£\d+/");
    this.priceSummarySection = page.locator("text=Price Summary").locator("..");
  }

  async gotoRoom(roomId: number, checkIn: string, checkOut: string) {
    await this.page.goto(
      `/reservation/${roomId}?checkin=${checkIn}&checkout=${checkOut}`,
    );
  }

  async clickReserveNow() {
    await this.reserveNowButton.click();
  }

  async fillBookingForm(
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
  ) {
    await this.firstnameInput.fill(firstname);
    await this.lastnameInput.fill(lastname);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async submitBooking() {
    await this.reserveNowButton.click();
  }

  async getTotalPriceText(): Promise<string> {
    const rows = this.page.locator("text=Total");
    return (await rows.first().locator("xpath=..").textContent()) ?? "";
  }

  async getCalendarMonth(): Promise<string> {
    return (
      (await this.page
        .locator(
          "text=/January|February|March|April|May|June|July|August|September|October|November|December/",
        )
        .first()
        .textContent()) ?? ""
    );
  }
}
