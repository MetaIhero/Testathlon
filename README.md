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
# Összes teszt
npm test

# Egy konkrét tesztcsomag
npm run test:tc001   # Szobafoglalás
npm run test:tc002   # Admin bejelentkezés
npm run test:tc003   # Kapcsolatfelvétel
```

## Projekt szerkezet

```
├── pages/
│   ├── HomePage.ts          – Főoldal Page Object
│   ├── RoomDetailPage.ts    – Szoba részletoldal + foglalási form PO
│   ├── AdminLoginPage.ts    – Admin login PO
│   ├── AdminDashboardPage.ts – Admin dashboard PO
│   └── ContactPage.ts       – Kapcsolatfelvételi form PO
├── tests/
│   ├── TC001_room_booking.spec.ts   – Szobafoglalás tesztek
│   ├── TC002_admin_login.spec.ts    – Admin auth tesztek
│   └── TC003_contact_form.spec.ts  – Kapcsolatfelvétel tesztek
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Prioritási sorrend

| # | Teszt        | Funkció            | Prioritás | Indoklás |
|---|--------------|---------------------|-----------|----------|
| 1 | TC001        | Szobafoglalás        | MAGAS     | Elsődleges bevételi folyamat; közvetlen pénzügyi hatás hibánál |
| 2 | TC002        | Admin bejelentkezés  | MAGAS     | Kapu a teljes adminhoz; kritikus biztonsági pont |
| 3 | TC003        | Kapcsolatfelvétel    | KÖZEPES   | Lead-generáló csatorna; validáció és UX minőség szempontjából fontos |
