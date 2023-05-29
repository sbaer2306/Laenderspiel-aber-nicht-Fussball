import React from 'react'
import { Polyline } from 'react-leaflet'

function MyPolyline({marker, cityCenter}) {
  
    const polyline = [
        [marker.lat, marker.lng],
        [cityCenter.lat, cityCenter.lng],
    ]

    const line = {color: 'red'};
  return (
    <Polyline pathOptions={line} positions={polyline} />
  )
}

export default MyPolyline