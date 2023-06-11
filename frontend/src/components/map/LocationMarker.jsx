import {useState} from 'react'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import {Marker, Popup, useMapEvents } from 'react-leaflet'

function LocationMarker({childToParent, clicked}) {
    const [position, setPosition] = useState(null)

    useMapEvents({
      click(e) {
        if(!clicked){
          setPosition(e.latlng);
          childToParent(e.latlng);  
        }
      },
    })

    return position === null ? null : (
        <Marker position={position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
          <Popup>Deine Position:<br></br>lat: {position.lat} <br></br>lon: {position.lng}</Popup>
        </Marker>
      )
}

export default LocationMarker