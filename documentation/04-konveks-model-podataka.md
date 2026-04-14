# Convex model podataka

## Tabele

### users

Interna baza korisnika sistema vezana za Clerk identitet.

### projects

Glavni zapis produkcijskog posla: klijent, tip, status, prioritet, datumi i lokacija.

### projectPhases

Faze rada po projektu: preprodukcija, produkcija, postprodukcija.

### equipment

Inventar tehničke opreme sa statusom i stanjem.

### studios

Studijski kapaciteti sa radnim vremenom i stanjem.

### staffProfiles

Operativni profil osobe, bez obaveze da svaka osoba ima login.

### staffAssignments

Angažmani osoblja po projektu i vremenskom intervalu.

### equipmentReservations

Rezervacije opreme.

### studioBookings

Rezervacije studija.

### maintenanceWindows

Planirano održavanje i blokade resursa.

### availabilityDependencies

Potrebni bundle resursa za realizaciju projekta ili faze.

### events

Incidenti i bitni operativni događaji.

### eventUpdates

Istorija odgovora i promjena statusa događaja.

### notifications

Ciljane notifikacije korisnicima.

### auditLogs

Sistemski zapis bitnih akcija.

## Server funkcije

Trenutno su dodani stubovi za:

- `users`
- `projects`
- `resources`
- `availability`
- `events`
- `notifications`

Njihova uloga u ovoj fazi je da:

- učvrste API granice
- pokažu gdje će ići guard logika
- pripreme codegen i buduće povezivanje UI-a
