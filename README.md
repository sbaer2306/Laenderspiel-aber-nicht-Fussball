# Länderspiel (aber nicht ⚽)

**Studienarbeit RESTful Webservices<br>**
Sommersemester 2023<br>
Hochschule für angewandte Wissenschaften Hof<br>
Gruppe 1<br>

#### Gruppenmitglieder:
- Sebastian Bär
- Dejan Fraas
- Eugen Kudraschow
- Johannes Matus
- David Weiß

### Dokumentation

 Die **API Dokumentation** wird unter [/api/doc](http://localhost:3000/api/doc) im Frontend angezeit. Die yaml Datei ist im Ordner **./apiDoc** des Projekts gespeichert.<br>
Die **Anfangspräsentation der Idee** ist im selben Ordner abgelegt.

## Vorraussetzung:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Ports

- **3000**: Frontend
- **8000**: Backend
- **8080**: PhpMyAdmin
- **3306**: Mysql
- **6379**: redis

## StA-Kriterien
- [x] **Hypermedia:** Pagination bei /user/{id}/played-games
- [x] **ETag Caching:** /user/{id}/stats
- [x] **Time Based Caching:** zum Beispiel factsService.js (Fakten über Länder)
- [x] **Google-Authentication**

## Setup:<br>
1. Repository clonen
2. ```DATABASE_URL= "mysql://root:<rootpasswort>@mysql-db:3306/laenderspiel"``` in .env backend hinzufügen (migrate braucht privilegien um shadow db anzulegen)
3. Starten Container: ```docker-compose up -d```
4. Eventuell manuell npm install im backend container ausführen
### Datenbankoperationen:
5. ```docker exec node_backend_container npx prisma db seed``` **Hinweis:** Lange genug warten, sonst kann es zu Problemen kommen (Error: Cannot find module '.prisma/client/index')
***

## APIs
Die Nachfolgenden APIs wurden genutzt.

### Overpass-API
- Freier Zugriff --> keine Anmeldung erforderlich.
Die Overpass API ist eine Schnittstelle für den Zugriff auf geografische Daten in der OpenStreetMap (OSM). Sie ermöglicht es gezielte Abfragen an die OSM-Datenbank zu stellen und spezifische Informationen über geografische Objekte abzurufen. (Runde 2 und 3)

URL = "https://overpass-api.de/api/interpreter?data=[out:json];relation["boundary"="administrative"]["name:en"="${countryName}"];out geom;"

**Beschreibung der Parameter:**

- `data=[out:json];`: Definiert das Ausgabeformat der Daten.
- `relation["boundary"="administrative"]["name:en"="${countryName}"];`: Definiert die spezifischen Kriterien für die gesuchte administrative Grenze.
- `out geom;`: Gibt die Geometriedaten (Koordinaten) der administrativen Grenzen zurück.

### Wikipedia API

- Freier Zugriff --> keine Anmeldung erforderlich.
- [Dokumentation](https://www.mediawiki.org/wiki/API:Main_page)

Die Wikipedia-API wird genutzt, um Informationen über touristische Attraktionen einer bestimmten Stadt abzurufen. (Runde 3)

**Beschreibung der Parameter:**

- `action=query`: Sendet eine Abfrage an die Wikipedia API.
- `format=json`: Die Antwort wird im JSON-Format zurückgegeben.
- `generator=categorymembers`: Ruft die Seiten in der angegebenen Kategorie auf.
- `gcmtitle=Category:Tourist_attractions_in_${city.name}`: Gibt die zu suchende Kategorie an.
- `gcmlimit=max`: Setzt das Limit für die Anzahl der zurückgegebenen Ergebnisse.
- `prop=pageimages`: Ruft die Bilder der Seiten auf.
- `piprop=original`: Ruft das Originalbild anstatt eines Miniaturbilds ab.

### Restcountries API

- Freier Zugriff --> keine Anmeldung erforderlich.
- [Dokumentation](https://restcountries.com/)

Um Fakten für ein spezifisches Land zu erhalten, wird folgende URL aufgerufen: `https://restcountries.com/v3.1/alpha/{code}`

### CountryFlags API

- Freier Zugriff --> keine Anmeldung erforderlich.
- [Dokumentation](https://flagsapi.com/)

Um die Flagge für ein spezifisches Land zu erhalten, wird folgende URL aufgerufen: `https://flagsapi.com/{code}/{style}/{size}.png`

**Beschreibung der Parameter:**

- `code`: CountryCode im Format cca2, ccn3, cca3 oder cioc Country Code.
- `style`: [Flaggenstile](https://flagsapi.com/#themes) (siehe Dokumentation).
- `size`: [Flaggengrößen](https://flagsapi.com/#sizes) (siehe Dokumentation).

***
