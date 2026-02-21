import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const testResultDir = path.resolve(__dirname, '..', '..', 'testresult');

test.afterEach(async ({ page }, testInfo) => {
  const testName = testInfo.title;
  if (testInfo.status === testInfo.expectedStatus) {
    console.log(`[PASS] ${testName} – sikeresen lezárult`);
  } else {
    if (!fs.existsSync(testResultDir)) {
      fs.mkdirSync(testResultDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = testName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const screenshotPath = path.join(testResultDir, `${safeName}_${timestamp}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const errorMessage = testInfo.error?.message || 'Ismeretlen hiba';
    const stackTrace = testInfo.error?.stack || '';
    const logContent = [
      `Teszt: ${testName}`,
      `Státusz: ${testInfo.status}`,
      `Hiba: ${errorMessage}`,
      `Stack: ${stackTrace}`,
      `Időpont: ${new Date().toISOString()}`,
      `Képernyőkép: ${screenshotPath}`,
    ].join('\n');
    const logPath = path.join(testResultDir, `${safeName}_${timestamp}.log`);
    fs.writeFileSync(logPath, logContent, 'utf-8');

    console.error(`[FAIL] ${testName} – SIKERTELEN`);
    console.error(`  Hiba: ${errorMessage}`);
    console.error(`  Képernyőkép: ${screenshotPath}`);
    console.error(`  Log: ${logPath}`);
  }
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
