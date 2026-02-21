/**
 * TC001 – Szobafoglalás sikeres lefoglalása
 * Funkció: Szobafoglalás (Booking)
 * Prioritás: MAGAS
 *
 * Indoklás:
 * A foglalás a webhely elsődleges üzleti folyamata – hiba esetén közvetlen
 * bevételkiesés következik be. Magas regressziós kockázat minden kiadásnál.
 *
 * Teszt neve       : TC001 – Sikeres szobafoglalás érvényes adatokkal
 * Rövid leírás     : Ellenőrizzük, hogy a vendég ki tudja tölteni a foglalási
 *                    űrlapot (Single Room, 2 éjszaka) érvényes adatokkal, és
 *                    a rendszer sikeresen feldolgozza a foglalást.
 * Előfeltételek    : A weboldal elérhető; a kiválasztott szoba szabad a
 *                    megadott dátumokra; a felhasználó nincs bejelentkezve.
 * Teszt lépések    : 1. Navigálj a Single Room részletoldalára (checkin=2026-04-10, checkout=2026-04-12)
 *                    2. Ellenőrizd az ár-összefoglalót (£100 × 2 éjszaka = £200 + díjak = £240)
 *                    3. Kattints a "Reserve Now" gombra → megjelenik az űrlap
 *                    4. Töltsd ki: Firstname=Test, Lastname=User, Email=test@example.com, Phone=01234567890
 *                    5. Kattints a "Reserve Now" gombra a véglegesítéshez
 *                    6. Ellenőrizd a sikeres visszajelzést
 * Várt eredmények  : A foglalás elfogadódik; a rendszer visszajelzést ad
 *                    (siker-üzenet vagy átirányítás megerősítő oldalra).
 */

import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import * as fs from 'fs';
import * as path from 'path';

test.describe('TC001 – Szobafoglalás (Booking) | MAGAS prioritás', () => {
  test('TC001-01 – Sikeres szobafoglalás érvényes adatokkal', async ({ page }) => {
    const roomPage = new RoomDetailPage(page);

    // 1. Navigálj a Single Room részletoldalára (2 éjszaka)
    await roomPage.gotoRoom(1, '2026-04-10', '2026-04-12');
    await page.waitForLoadState('networkidle');

    // 2. Az ár-összesítő helyes értékeket mutat
    const pagText = await page.textContent('body');
    expect(pagText).toContain('£100 x 2 nights');
    expect(pagText).toContain('£200');
    expect(pagText).toContain('£240');

    // 3. Reserve Now → foglalásiűrlap megjelenik
    await roomPage.clickReserveNow();
    await expect(roomPage.firstnameInput).toBeVisible({ timeout: 5000 });

    // 4. Érvényes adatok kitöltése
    await roomPage.fillBookingForm('Test', 'User', 'test@example.com', '01234567890');

    // 5. Foglalás véglegesítése
    await roomPage.submitBooking();

    // 6. Siker-visszajelzés megjelenik
    await expect(
      page.locator('text=/Booking Successful|Confirmed|Thank you|success/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('TC001-02 – Foglalási kísérlet hiányos adatokkal (negatív eset)', async ({ page }) => {
    const roomPage = new RoomDetailPage(page);

    // Navigálj a részletoldalra
    await roomPage.gotoRoom(1, '2026-04-10', '2026-04-12');
    await page.waitForLoadState('networkidle');

    // Nyisd meg a foglalási űrlapot
    await roomPage.clickReserveNow();
    await expect(roomPage.firstnameInput).toBeVisible({ timeout: 5000 });

    // Csak a keresztnév kitöltése – többi üres
    await roomPage.firstnameInput.fill('Test');

    // Kísérlet a foglalás elküldésére
    await roomPage.submitBooking();

    // Hibaüzenet vagy validációs jelzés jelenik meg
    const body = await page.textContent('body');
    const hasError =
      body?.includes('required') ||
      body?.includes('invalid') ||
      body?.includes('error') ||
      body?.includes('field') ||
      (await page.locator('.alert, [class*="error"], [class*="invalid"]').count()) > 0;

    expect(hasError).toBeTruthy();
  });

  test('TC001-03 – Ár-összesítő helyes számítása különböző dátumokra', async ({ page }) => {
    const roomPage = new RoomDetailPage(page);

    // 1 éjszaka
    await roomPage.gotoRoom(1, '2026-05-01', '2026-05-02');
    await page.waitForLoadState('networkidle');
    let body = await page.textContent('body');
    expect(body).toContain('£100 x 1 nights');

    // 3 éjszaka
    await roomPage.gotoRoom(1, '2026-05-01', '2026-05-04');
    await page.waitForLoadState('networkidle');
    body = await page.textContent('body');
    expect(body).toContain('£100 x 3 nights');
    expect(body).toContain('£300');
  });
});
