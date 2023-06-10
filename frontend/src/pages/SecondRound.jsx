import '../css/SecondRound.css'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import LocationMarker from '../components/map/LocationMarker';
import GeoFetch from '../components/map/FetchGeo'
import Polyline from '../components/map/Polyline'

function SecondRound() {

  const [position, setPosition] = useState('');
  const [center, setCenter] = useState('');

  const MarkerPosition = (childdata) =>{
      setPosition(childdata);
  }

  const CenterCountry = (childdata) =>{
    setCenter(childdata);
  }

  return (
    <div className="container_second_round">
        <h1>Runde 2</h1>
        <MapContainer center={[51.5, 10]} zoom={4} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
                //url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png"
            />
            <LocationMarker childToParent={MarkerPosition}/>
            <GeoFetch childToParent={CenterCountry}/>
            {position ? (<Polyline marker={position} center={center}/>) : (null)}
        </MapContainer>
    </div>
  );
}

export default SecondRound;
