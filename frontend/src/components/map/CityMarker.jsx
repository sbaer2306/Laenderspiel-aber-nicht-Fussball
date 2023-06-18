import React from 'react';
import { Icon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';

const CityMarker = ({ cities }) => {

    return (
        <>
            {Object.keys(cities).map((cityName) => {
                const city = cities[cityName];
                const lat = city.coordinates[0];
                const lon = city.coordinates[1];

                return (
                    <Marker
                        key={cityName}
                        position={[lat, lon]}
                        icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
                    >
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
                );
            })}
        </>
    );
};

export default CityMarker;

