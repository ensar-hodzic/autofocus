# Domenski model

Domenski model prati dokumentaciju projekta i širi je onoliko koliko je potrebno da aplikacija ostane realno proširiva.

## Glavni moduli

- `Availability Management`
- `Event Management`

## Ključni entiteti

### Korisnici i pristupi

- `users`
- `staffProfiles`

`users` predstavlja autentificirane korisnike sistema. `staffProfiles` predstavlja operativni profil osobe u firmi ili vanjskog saradnika. Time sistem ne zavisi od toga da svaka osoba mora imati login.

### Produkcija

- `projects`
- `projectPhases`

Projekt je glavni poslovni zapis. Faze projekta su izdvojene zato što su preprodukcija, produkcija i postprodukcija prirodne cjeline koje će kasnije imati svoje statuse i zavisnosti.

### Resursi

- `equipment`
- `studios`
- `staffAssignments`
- `equipmentReservations`
- `studioBookings`
- `maintenanceWindows`
- `availabilityDependencies`

Resursi su odvojeni po vrsti jer njihove rezervacije imaju različita pravila i različite atribute.

### Događaji i nadzor

- `events`
- `eventUpdates`
- `notifications`
- `auditLogs`

`events` služe za aktivne incidente i operativna odstupanja. `eventUpdates` drži istoriju reakcija. `auditLogs` je širi sistemski trag bitnih izmjena.

## Statusi

### Resource status

- `available`
- `reserved`
- `confirmed`
- `conditionally_available`
- `maintenance`
- `in_transport`
- `out_of_service`

### Booking status

- `draft`
- `pending`
- `confirmed`
- `cancelled`
- `completed`

### Event severity

- `info`
- `warning`
- `high`
- `critical`

### Event status

- `open`
- `acknowledged`
- `in_progress`
- `resolved`
- `closed`

## Veza sa dokumentacijom

Model direktno podržava:

- centralnu bazu resursa
- pregled dostupnosti opreme, studija i osoblja
- provjeru konflikata rezervacija
- prijavu i obradu tehničkih događaja
- pregled rada po pristupnim nivoima
