import React from 'react';
import { Icon } from 'leaflet';
import { Marker, Popup, Polyline } from 'react-leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';

const CityMarker = ({ cities, guessedCoordinates }) => {
  return (
    <>
      {Object.keys(cities).map((cityName, index) => {
        const city = cities[cityName];
        const lat = city.coordinates[0];
        const lon = city.coordinates[1];
        const guessedCoordinate = guessedCoordinates[index];

        const cityIcon = new Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        });

        const guessedIcon = new Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        });

        return (
          <React.Fragment key={cityName}>
            <Marker position={[lat, lon]} icon={cityIcon}>
              <Popup>
                City: {cityName}
                <br />
                Coordinates:
                <br />
                lat: {lat}
                <br />
                lon: {lon}
              </Popup>
            </Marker>
            {guessedCoordinate && (
              <React.Fragment>
                <Polyline positions={[[lat, lon], guessedCoordinate]} color="red" />
                <Marker position={guessedCoordinate} icon={guessedIcon}>
                  <Popup>
                    Guessed Coordinates:
                    <br />
                    lat: {guessedCoordinate[0]}
                    <br />
                    lon: {guessedCoordinate[1]}
                  </Popup>
                </Marker>
              </React.Fragment>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default CityMarker;
