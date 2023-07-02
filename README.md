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

## Setup:<br>
1. Repository clonen
2. ```DATABASE_URL= "mysql://root:<rootpasswort>@mysql-db:3306/laenderspiel"``` in .env backend hinzufügen (migrate braucht privilegien um shadow db anzulegen)
3. Starten Container: ```docker-compose up -d```
4. Eventuell manuell npm install im backend container ausführen
### Datenbankoperationen:
5. ```docker exec node_backend_container npx prisma db seed``` **Hinweis:** Lange genug warten, sonst kann es zu Problemen kommen (Error: Cannot find module '.prisma/client/index')

## API Credentials
- **TODO**: API Zugangsdaten bzw. Anleitung zum Erstellen und setzen dieser für die 3rd party APIs (RESTcountries, Wikipedia, ...)

# Overpass-API:
    Die Overpass API ist eine Schnittstelle für den Zugriff auf geografische Daten in der OpenStreetMap (OSM). Sie ermöglicht es Entwicklern und Benutzern, gezielte Abfragen an die OSM-Datenbank zu stellen und spezifische Informationen über geografische Objekte abzurufen. Die Overpass API bietet eine flexible Abfragesprache, die es ermöglicht, komplexe Anfragen zu stellen und verschiedene Kriterien wie Tags, Geometrie und geografischen Bereich zu berücksichtigen. Mit dieser API können Benutzer beispielsweise nach bestimmten Arten von POIs (Points of Interest), Straßen, Gebäuden oder anderen geografischen Elementen suchen.

    URL = "https://overpass-api.de/api/interpreter?data=[out:json];relation["boundary"="administrative"]["name:en"="${countryName}"];out geom;"
    
    Beschreibung der Parameter:
        'data=[out:json];' : : Dieser Teil der Abfrage definiert das gewünschte Ausgabeformat der Daten
        'relation["boundary"="administrative"]["name:en"="${countryName}"];' : Dieser Teil der Abfrage definiert die spezifischen Kriterien für die zu suchende administrative Grenze. 
            Hier werden zwei Filterkriterien verwendet:
                - ["boundary"="administrative"] filtert nach Beziehungen (relations), die den "boundary"-Tag mit dem Wert "administrative" haben. Dadurch werden nur administrative Grenzen ausgewählt.
                - ["name:en"="${countryName}"] filtert nach Beziehungen, deren "name:en"-Tag den Wert des Platzhalters "${countryName}" hat. Der Platzhalter ${countryName} rmöglicht die dynamische Anpassung der Abfrage für verschiedene Länder.
        'out geom;' : Dieser Teil der Abfrage gibt an, dass neben den Informationen der administrativen Grenzen auch die Geometriedaten (Koordinaten) zurückgegeben werden sollen. Damit erhält man die tatsächlichen Grenzkoordinaten des Landes.

# Wikipedia API: 

    - ist frei zugänglich, benötigt keine credentials
    - Link zur Doc: https://www.mediawiki.org/wiki/API:Main_page

    Folgende URL wird für die Requests an die Wikipedia API genutzt.

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
