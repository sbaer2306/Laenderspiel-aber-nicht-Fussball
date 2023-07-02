# Länderspiel (aber nicht ⚽)

**Studienarbeit RESTful Webservices<br>**
Sommersemester 2023<br>
Hochschule für angewandte Wissenschaften Hof<br>

#### Gruppenmitglieder:
- Sebastian Bär
- Dejan Fraas
- Eugen Kudraschow
- Johannes Matus
- David Weiß

### API Dokumentation

 Die API Dokumentation wird unter [/api/doc](http://localhost:3000/api/doc) im Frontend angezeit. Das React package benötigt die Dokumentation allerdings als json, deshalb im Swagger Editor als json exportieren (File > Convert and save as json) und dann im frontend in /src/components/ApiDoc einfügen bzw. altes File überschreiben, damit die Dokumentation auch unter [/api/doc](http://localhost:3000/api/doc) angezeigt wird.

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

## APIs
Die Nachfolgenden APIs wurden genutzt.

### Overpass-API

Die Overpass API ist eine Schnittstelle für den Zugriff auf geografische Daten in der OpenStreetMap (OSM). Sie ermöglicht es gezielte Abfragen an die OSM-Datenbank zu stellen und spezifische Informationen über geografische Objekte abzurufen. (Runde 2 und 3)

URL = "https://overpass-api.de/api/interpreter?data=[out:json];relation["boundary"="administrative"]["name:en"="${countryName}"];out geom;"

**Beschreibung der Parameter:**

- `data=[out:json];`: Definiert das Ausgabeformat der Daten.
- `relation["boundary"="administrative"]["name:en"="${countryName}"];`: Definiert die spezifischen Kriterien für die gesuchte administrative Grenze.
- `out geom;`: Gibt die Geometriedaten (Koordinaten) der administrativen Grenzen zurück.

### Wikipedia API

- Freier Zugriff ohne Anmeldung erforderlich.
- [Dokumentation](https://www.mediawiki.org/wiki/API:Main_page)

URL = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:Tourist_attractions_in_${city.name}&gcmlimit=max&prop=pageimages&piprop=original&pithumbsize=500"

Die Wikipedia-API wird genutzt, um Informationen über touristische Attraktionen einer bestimmten Stadt abzurufen. (Runde 3)

**Beschreibung der Parameter:**

- `action=query`: Sendet eine Abfrage an die Wikipedia API.
- `format=json`: Die Antwort wird im JSON-Format zurückgegeben.
- `generator=categorymembers`: Ruft die Seiten in der angegebenen Kategorie auf.
- `gcmtitle=Category:Tourist_attractions_in_${city.name}`: Gibt die zu suchende Kategorie an.
- `gcmlimit=max`: Setzt das Limit für die Anzahl der zurückgegebenen Ergebnisse.
- `prop=pageimages`: Ruft die Bilder der Seiten auf.
- `piprop=original`: Ruft das Originalbild anstatt eines Miniaturbilds ab.
- `pithumbsize=500`: Legt die Größe des Miniaturbilds fest (maximale Breite von 500px).

