import { Page, Locator } from "@playwright/test";

export class AdminDashboardPage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly roomsSection: Locator;
  readonly bookingsSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page
      .getByRole("button", { name: "Logout" })
      .or(page.getByRole("link", { name: "Logout" }));
    this.roomsSection = page
      .locator('[data-testid="rooms"], .rooms-panel, text=Rooms')
      .first();
    this.bookingsSection = page
      .locator('[data-testid="bookings"], .bookings-panel, text=Bookings')
      .first();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
