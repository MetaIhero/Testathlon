# Shady Meadows B&B – Playwright Tesztek

## Telepítés

```bash
npm install
npx playwright install
npm install dotenv --save-dev
```

## Konfigurálás

A `.env` fájlban állítsd be a `BASE_URL`-t:

```env
BASE_URL=https://automation.testathon.hu
```

A `playwright.config.ts` automatikusan betölti a `.env` fájlt a `dotenv` segítségével.

## Futtatás

```bash
# Összes teszt (UI + API BDD)
npm test

# Csak UI tesztek
npm run test:ui

# Csak API BDD tesztek
npm run test:api

# Egy konkrét tesztcsomag
npm run test:tc001   # Szobafoglalás
npm run test:tc002   # Admin bejelentkezés
npm run test:tc003   # Kapcsolatfelvétel

# BDD spec fájlok újragenerálása
npm run bddgen
```

## Projekt szerkezet

```
├── pages/                              – Page Object Model-ek (UI)
│   ├── HomePage.ts
│   ├── RoomDetailPage.ts
│   ├── AdminLoginPage.ts
│   ├── AdminDashboardPage.ts
│   └── ContactPage.ts
├── tests/                              – UI tesztek (Playwright)
│   ├── TC001_room_booking.spec.ts
│   ├── TC002_admin_login.spec.ts
│   └── TC003_contact_form.spec.ts
├── api-tests/                          – BDD API tesztek (Gherkin + playwright-bdd)
│   ├── features/                       – Gherkin feature fájlok
│   │   ├── auth.feature                – Autentikáció (5 szcenárió)
│   │   ├── rooms.feature               – Szobakezelés CRUD (7 szcenárió)
│   │   ├── booking.feature             – Foglalások (5 szcenárió)
│   │   └── messages.feature            – Üzenetek (7 szcenárió)
│   ├── steps/                          – Step definíciók
│   │   ├── common.steps.ts             – Közös Given/Then lépések
│   │   ├── auth.steps.ts
│   │   ├── rooms.steps.ts
│   │   ├── booking.steps.ts
│   │   └── messages.steps.ts
│   ├── fixtures/
│   │   └── api-fixtures.ts             – Egyedi Playwright fixture-ök (apiClient, scenarioContext)
│   └── support/
│       ├── api-client.ts               – Típusos API kliens (Playwright request wrapper)
│       └── types.ts                    – TypeScript interfészek (Room, Booking, Message)
├── .features-gen/                      – Generált spec fájlok (gitignored)
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## BDD API tesztek

A projekt [playwright-bdd](https://github.com/vitalets/playwright-bdd) keretrendszert használ Gherkin `.feature` fájlokkal az API teszteléshez. A Playwright beépített `request` API-ját használja HTTP hívásokhoz (nincs szükség böngészőre).

### Architektúra

- **Feature fájlok** (`api-tests/features/`) — Gherkin szintaxisú tesztesetek
- **Step definíciók** (`api-tests/steps/`) — A Gherkin lépések TypeScript implementációja
- **ApiClient** (`api-tests/support/api-client.ts`) — Típusos wrapper a Playwright `request` fölött, automatikus token kezeléssel
- **Fixtures** (`api-tests/fixtures/api-fixtures.ts`) — `apiClient` és `scenarioContext` minden szcenárióhoz frissen példányosítva

### API lefedettség

| Feature fájl       | Végpontok                                          | Szcenáriók |
|--------------------|----------------------------------------------------|------------|
| auth.feature       | POST /auth/login, POST /auth/validate              | 5          |
| rooms.feature      | GET/POST/PUT/DELETE /room/                          | 7          |
| booking.feature    | GET/POST/DELETE /booking/                           | 5          |
| messages.feature   | GET/POST/DELETE /message/, GET /message/count       | 7          |
| **Összesen**       | **15 végpont**                                      | **24**     |

### Működés

A `playwright-bdd` a `.feature` fájlokból generál Playwright-kompatibilis `.spec.ts` fájlokat a `.features-gen/` mappába. Ez a `npx bddgen` paranccsal történik, amit az `npm test` és `npm run test:api` scriptek automatikusan futtatnak.

## Prioritási sorrend

| # | Teszt        | Funkció            | Prioritás | Indoklás |
|---|--------------|---------------------|-----------|----------|
| 1 | TC001        | Szobafoglalás        | MAGAS     | Elsődleges bevételi folyamat; közvetlen pénzügyi hatás hibánál |
| 2 | TC002        | Admin bejelentkezés  | MAGAS     | Kapu a teljes adminhoz; kritikus biztonsági pont |
| 3 | TC003        | Kapcsolatfelvétel    | KÖZEPES   | Lead-generáló csatorna; validáció és UX minőség szempontjából fontos |
