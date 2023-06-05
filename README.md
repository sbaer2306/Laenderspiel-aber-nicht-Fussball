# Länderspiel (aber nicht ⚽)

**Studienarbeit RESTful Webservices<br>**
Sommersemester 2023<br>
Hochschule für angewandte Wisswnschaften Hof<br>

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
### Datenbankoperationen:
Müssen (noch) manuell durchgeführt werden, falls der db-Container noch nicht rechtzeitig aktiv ist.

6. ```docker exec node_backend_container npx prisma db push --accept-data-loss``` (Letzte Migration anwenden)
7. ```docker exec node_backend_container npx prisma db seed``` (Füllt Datenbank mit sample Daten)

## API Credentials
- **TODO**: API Zugangsdaten bzw. Anleitung zum Erstellen und setzen dieser für die 3rd party APIs (RESTcountries, Wikipedia, ...)
