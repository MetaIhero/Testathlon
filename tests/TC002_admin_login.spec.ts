import { test, expect } from "@playwright/test";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import * as fs from "fs";
import * as path from "path";

test.describe("TC002 – Admin bejelentkezés (Authentication) | MAGAS prioritás", () => {
  const testResultDir = path.resolve(__dirname, "..", "test-results");

  test.afterEach(async ({ page }, testInfo) => {
    const testName = testInfo.title;
    if (testInfo.status === testInfo.expectedStatus) {
      console.log(`[PASS] ${testName} – sikeresen lezárult`);
    } else {
      if (!fs.existsSync(testResultDir)) {
        fs.mkdirSync(testResultDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const safeName = testName.replace(/[^a-zA-Z0-9_-]/g, "_");
      const screenshotPath = path.join(
        testResultDir,
        `${safeName}_${timestamp}.png`,
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const errorMessage = testInfo.error?.message || "Ismeretlen hiba";
      const stackTrace = testInfo.error?.stack || "";
      const logContent = [
        `Teszt: ${testName}`,
        `Státusz: ${testInfo.status}`,
        `Hiba: ${errorMessage}`,
        `Stack: ${stackTrace}`,
        `Időpont: ${new Date().toISOString()}`,
        `Képernyőkép: ${screenshotPath}`,
      ].join("\n");
      const logPath = path.join(testResultDir, `${safeName}_${timestamp}.log`);
      fs.writeFileSync(logPath, logContent, "utf-8");

      console.error(`[FAIL] ${testName} – SIKERTELEN`);
      console.error(`  Hiba: ${errorMessage}`);
      console.error(`  Képernyőkép: ${screenshotPath}`);
      console.error(`  Log: ${logPath}`);
    }
  });

  test("TC002-01 – Sikeres admin bejelentkezés érvényes hitelesítőkkel", async ({
    page,
  }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboard = new AdminDashboardPage(page);

    // 1. Navigálás az admin bejelentkezési oldalra
    await loginPage.goto();
    await expect(page).toHaveURL(/.*admin/);

    // 2. Ellenőrzés: login form látható
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // 3. Helyes hitelesítők megadása és login
    await loginPage.login("admin", "password");

    // 4. Dashboard betölt – Logout gomb megjelenik
    await expect(dashboard.logoutButton).toBeVisible({ timeout: 10000 });

    // Az URL nem az /admin login oldal
    await expect(page).not.toHaveURL(/.*admin$/);
  });

  test("TC002-02 – Sikertelen bejelentkezés helytelen jelszóval (negatív eset)", async ({
    page,
  }) => {
    const loginPage = new AdminLoginPage(page);

    // 1. Navigálás
    await loginPage.goto();

    // 2. Helytelen jelszó megadása
    await loginPage.login("admin", "wrongpassword123");

    // 3. Az URL marad /admin
    await expect(page).toHaveURL(/.*admin/);

    // 4. Hibaüzenet vagy az input mezők újra láthatók (nem irányít át)
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 5000 });
  });

  test("TC002-03 – Sikertelen bejelentkezés üres mezőkkel", async ({
    page,
  }) => {
    const loginPage = new AdminLoginPage(page);

    await loginPage.goto();

    // Login klikk üres mezőkkel
    await loginPage.loginButton.click();

    // Az oldal /admin marad, nem irányít át
    await expect(page).toHaveURL(/.*admin/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
