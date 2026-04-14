# Frontend struktura

## Glavni tokovi

### Public

- landing stranica
- sign-in stranica

### Protected

- dashboard
- projekti
- oprema
- studiji
- osoblje
- događaji
- administracija pristupa

## Dashboard

Prvi funkcionalni ekran je management dashboard. Podaci su hardkodirani, ali njihov oblik prati buduće Convex odgovore. To znači da će kasnije zamjena fixture podataka stvarnim query pozivima biti jednostavna.

Dashboard trenutno prikazuje:

- KPI kartice
- naredne rezervacije
- iskorištenost resursa
- kritične događaje
- današnje angažmane
- brze linkove prema modulima

## Vizuelni smjer

Pošto si tražio komponentnu biblioteku koja radi dobro bez mnogo dorade, izabran je Ant Design. Dizajn je lagano prilagođen kroz:

- custom token boje
- staklasti surface sloj
- izraženiju tipografiju

Mockup stil iz PDF-a nije kopiran. Fokus je bio na brzom, upotrebljivom i admin-friendly interfejsu.
