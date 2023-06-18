import React from 'react'
import {useState} from 'react'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import {Marker, Popup, useMapEvents } from 'react-leaflet'

const CityMarker = ( {cities} ) => {
    return (
        <>
          {cities.map((city, index) => (
            <Marker key={index} position={[city.lat, city.lon]}>
              <Popup>
                Stadt {index + 1}<br />
                Koordinaten:<br />
                lat: {city.lat}<br />
                lon: {city.lon}
              </Popup>
            </Marker>
          ))}
        </>
    );
}

export default CityMarker
