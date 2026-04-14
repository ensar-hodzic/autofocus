# Auth i RBAC

## Zašto Clerk + Convex

Za ovaj projekat je izabran pristup gdje:

- Clerk rješava prijavu, sesiju i identity provider sloj
- Convex čuva domenske korisnike i provodi pravila pristupa

Ovaj model je praktičan za Next.js jer smanjuje količinu custom auth koda, a Convex i dalje ostaje mjesto gdje se štite server funkcije.

## Access level

- `admin`
- `management`
- `operations`
- `technical_support`

## Role

- `administrator`
- `production_manager`
- `project_coordinator`
- `photographer`
- `videographer`
- `lighting_technician`
- `studio_operator`
- `it_support`
- `editor`
- `render_operator`

## RBAC pristup

RBAC je definisan kroz `routePermissions` mapu u shared domain package-u. Isti skup pravila koristi se za:

- skrivanje stavki u navigaciji
- zaštitu frontend ruta
- zaštitu Convex query i mutation funkcija

## Demo režim

Pošto projekat mora biti odmah pregledan i bez vanjskih ključeva, uveden je demo režim:

- sign-in stranica nudi lokalne profile
- izbor profila postavlja httpOnly cookie
- protected rute rade sa tim profilom

Kada se dodaju Clerk ključevi, aplikacija automatski prelazi na Clerk tok prijave.
