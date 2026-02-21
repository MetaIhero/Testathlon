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


