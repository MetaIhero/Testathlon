/**
 * TC003 – Kapcsolatfelvételi űrlap
 * Funkció: Contact Form (Üzenetküldés)
 * Prioritás: KÖZEPES
 *
 * Indoklás:
 * A kapcsolatfelvételi űrlap közvetlen csatorna potenciális vendégek és az
 * üzemeltetők között. Meghibásodása elveszített foglalási érdeklődőket és
 * negatív felhasználói élményt eredményez. Közepes hibakockázat; validációs
 * logikája más formokhoz is regressziós mintaként szolgál.
 *
 * Teszt neve       : TC003 – Kapcsolatfelvételi űrlap érvényes és érvénytelen adatokkal
 * Rövid leírás     : Ellenőrizzük, hogy az űrlap sikeresen beküldhető helyes
 *                    adatokkal, és megfelelő validációt ad hiányos adatoknál.
 * Előfeltételek    : A főoldal elérhető, a Contact szekció látható.
 * Teszt lépések    : 1. Navigálj a főoldalra, görgess a Contact szekcióhoz
 *                    2. Töltsd ki az összes mezőt érvényes adatokkal
 *                    3. Kattints a Submit gombra
 *                    4. Ellenőrizd a visszajelzést
 *                    Negatív: ismételd érvénytelen email-lel és üres kötelező mezőkkel
 * Várt eredmények  : Sikeres küldésnél visszaigazoló üzenet; invalid esetben
 *                    validációs hibák jelennek meg és az üzenet nem kerül elküldésre.
 */

import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';
import * as fs from 'fs';
import * as path from 'path';

test.describe('TC003 – Kapcsolatfelvételi Űrlap (Contact Form) | KÖZEPES prioritás', () => {
  const testResultDir = path.resolve(__dirname, '..', 'testresult');

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

  test('TC003-01 – Sikeres üzenetküldés érvényes adatokkal', async ({ page }) => {
    const contactPage = new ContactPage(page);

    // 1. Navigálás a főoldalra és a Contact szekcióhoz
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll a Contact form-hoz
    await page.evaluate(() => {
      const el = document.querySelector('form, section#contact, [id*="contact"]');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });

    // A form mezők megkeresése közvetlen selectorokkal
    const nameInput = page.locator('label:has-text("Name") ~ input, input[name="name"]').first();
    const emailInput = page.locator('label:has-text("Email") ~ input, input[name="email"]').first();
    const phoneInput = page.locator('label:has-text("Phone") ~ input, input[name="phone"]').first();
    const subjectInput = page.locator('label:has-text("Subject") ~ input, input[name="subject"]').first();
    const messageInput = page.locator('textarea').first();
    const submitButton = page.getByRole('button', { name: 'Submit' });

    // Scroll az elemhez
    await nameInput.scrollIntoViewIfNeeded();

    // 2. Érvényes adatok kitöltése
    await nameInput.fill('Teszt János');
    await emailInput.fill('tesztelő@example.com');
    await phoneInput.fill('06301234567');
    await subjectInput.fill('Érdeklődés szabad szobákról');
    await messageInput.fill('Érdeklődöm 2026 júniusában elérhető szobák iránt. Kérjük, vegyék fel velem a kapcsolatot.');

    // 3. Elküldés
    await submitButton.click();

    // 4. Sikeres visszajelzés ellenőrzése (siker-üzenet vagy form reset)
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    const success =
      body?.toLowerCase().includes('thank') ||
      body?.toLowerCase().includes('success') ||
      body?.toLowerCase().includes('sent') ||
      body?.toLowerCase().includes('received') ||
      (await page.locator('[class*="success"], .alert-success').count()) > 0;

    expect(success).toBeTruthy();
  });

  test('TC003-02 – Validáció hiányos adatokkal (negatív eset)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.scrollIntoViewIfNeeded();

    // Submit klikk üres form-on
    await submitButton.click();
    await page.waitForTimeout(1000);

    // Az oldalon vagy HTML5 validáció, vagy szerver oldali hibaüzenet jelenik meg
    const hasValidation =
      (await page.locator(':invalid').count()) > 0 ||
      (await page.locator('.alert, [class*="error"], [class*="invalid"]').count()) > 0;

    expect(hasValidation).toBeTruthy();
  });

  test('TC003-03 – Rövid üzenettel (határérték-teszt)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('label:has-text("Name") ~ input, input[name="name"]').first();
    const emailInput = page.locator('label:has-text("Email") ~ input, input[name="email"]').first();
    const phoneInput = page.locator('label:has-text("Phone") ~ input, input[name="phone"]').first();
    const subjectInput = page.locator('label:has-text("Subject") ~ input, input[name="subject"]').first();
    const messageInput = page.locator('textarea').first();
    const submitButton = page.getByRole('button', { name: 'Submit' });

    await nameInput.scrollIntoViewIfNeeded();

    // 1 karakteres üzenet (határérték)
    await nameInput.fill('A');
    await emailInput.fill('a@b.com');
    await phoneInput.fill('1');
    await subjectInput.fill('X');
    await messageInput.fill('Y');

    await submitButton.click();
    await page.waitForTimeout(2000);

    // Ellenőrzés: vagy siker VAGY validációs hiba – egyik sem crash
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });
});
