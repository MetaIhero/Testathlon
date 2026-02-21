import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly checkInInput: Locator;
  readonly checkOutInput: Locator;
  readonly checkAvailabilityButton: Locator;
  readonly bookNowHeroButton: Locator;
  readonly roomCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkInInput = page
      .locator(
        'input[name="checkin"], input[placeholder*="Check"], .checkin input',
      )
      .first();
    this.checkOutInput = page
      .locator(
        'input[name="checkout"], input[placeholder*="Check"], .checkout input',
      )
      .first();
    this.checkAvailabilityButton = page.getByRole("button", {
      name: "Check Availability",
    });
    this.bookNowHeroButton = page
      .getByRole("link", { name: "Book Now" })
      .first();
    this.roomCards = page.locator('.card, [class*="room"]');
  }

  async goto() {
    await this.page.goto("/");
  }

  async checkAvailability(checkIn: string, checkOut: string) {
    await this.checkInInput.fill(checkIn);
    await this.checkOutInput.fill(checkOut);
    await this.checkAvailabilityButton.click();
  }
}
