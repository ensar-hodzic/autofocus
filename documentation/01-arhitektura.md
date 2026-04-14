# Arhitektura sistema

Autofocus je organizovan kao monorepo zato što projekat već u startu ima tri jasno odvojena sloja:

- frontend aplikaciju
- zajednički domen i poslovna pravila
- backend model i server funkcije

## Zašto monorepo

Monorepo ovdje ima smisla zato što:

- frontend i backend dijele iste poslovne pojmove
- RBAC pravila trebaju biti dosljedna i na klijentu i na serveru
- statusi rezervacija, događaja i pristupnih nivoa ne trebaju biti duplirani
- lakše je proširiti projekat dodatnim aplikacijama kasnije

## Slojevi

### apps/web

Sadrži Next.js App Router aplikaciju. Tu se nalazi:

- public landing i sign-in tok
- protected layout sa navigacijom
- management dashboard
- placeholder stranice za buduće module

### packages/domain

Sadrži:

- enum skupove i union tipove
- route permission map
- dashboard DTO oblike
- pomoćne funkcije za overlap i status transition logiku

### convex

Sadrži:

- schema definiciju
- auth helper sloj
- query i mutation stubove
- funkcije koje kasnije mogu emitovati event i audit zapise

## Autentifikacija i autorizacija

Arhitektura je postavljena za `Clerk + Convex` model:

- Clerk upravlja identitetom i sesijom
- aplikacija čita metadata vrijednosti za `role` i `accessLevel`
- Convex koristi lokalnu `users` tabelu kao interni izvor istine

Dok se ključevi ne dodaju, frontend radi preko demo cookie sesije kako bi UI i route flow bili upotrebljivi odmah.
