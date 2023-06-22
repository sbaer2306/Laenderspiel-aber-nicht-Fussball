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

## Setup:<br>
1. Repository clonen
2. .env File erstellen mit den Parametern
    - Test
    - Test2
3. ```DATABASE_URL= "mysql://root:<rootpasswort>@mysql-db:3306/laenderspiel"``` in .env backend hinzufügen (migrate braucht privilegien um shadow db anzulegen)
4. Starten Container: ```docker-compose up -d```
5. Eventuell manuell npm install im backend container ausführen
### Datenbankoperationen:
Müssen (noch) manuell durchgeführt werden, falls der db-Container noch nicht rechtzeitig aktiv ist.

6. ```docker exec node_backend_container npx prisma db push --accept-data-loss``` (Letzte Migration anwenden, Hinweis: DB Container muss dafür schon oben sein sonst Fehler)
7. ```docker exec node_backend_container npx prisma db seed``` (Füllt Datenbank mit sample Daten)

## API Credentials
- **TODO**: API Zugangsdaten bzw. Anleitung zum Erstellen und setzen dieser für die 3rd party APIs (RESTcountries, Wikipedia, ...)

# Wikipedia API: 
    URL = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:Tourist_attractions_in_${city.name}&gcmlimit=max&prop=pageimages&piprop=original&pithumbsize=500"

    Die Wikipedia-API wird genutzt, um Informationen über touristische Attraktionen einer bestimmten Stadt abzurufen. Indem man die richtigen Parameter verwendet und einstellt, erhält man eine Liste im JSON-Format, die Namen und Bilder der touristischen Attraktionen in der angegebenen Stadt enthält.

    Beschreibung der Parameter: 
        `action=query`: gibt, das Abfrage an Wikipedia API gesendet wird.
        `format=json`: die Antwort wird im JSON-Format zurückgegeben.
        `generator=categorymembers`: ruft die Seiten in der angegegeben Kategorie auf.
        `gcmtitle=Category:Tourist_attractions_in_${city.name}`: gibt die Kategorie an, nach der gesucht werden soll.
        `gcmlimit=max`: setzt das Limit für die Anzahl der zurückgegebenen Ergebnisse.
        `prop=pageimages`: ruft die Bilder der Seiten auf.
        `piprop=original`: ruft das Originalbild auf anstatt ein Miniaturbild.
        `pithumbsize=500`: legt die Größe des Miniaturbilds fest (Maximale Breite 500px).

## StA-Kriterien
- [x] **Hypermedia:** Pagination bei /user/{id}/played-games
- [x] **ETag Caching:** /user/{id}/stats
- [x] Time Based Caching: zum Beispiel factsService.js (Fakten über Länder)
- [x] Google-Authentication
