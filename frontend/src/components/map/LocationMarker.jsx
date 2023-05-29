import {useState} from 'react'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import {Marker, Popup, useMapEvents } from 'react-leaflet'

function LocationMarker({childToParent}) {
    const [position, setPosition] = useState(null)
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        childToParent(e.latlng);
      },
    })

    return position === null ? null : (
        <Marker position={position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
          <Popup>Your Location</Popup>
        </Marker>
      )
}

export default LocationMarker