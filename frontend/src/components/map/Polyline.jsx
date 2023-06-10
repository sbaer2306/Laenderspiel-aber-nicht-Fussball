import React from 'react'
import { Polyline } from 'react-leaflet'

function MyPolyline({marker, center}) {
  
    const polyline = [
        [marker.lat, marker.lng],
        [center.lat, center.lon],
    ]

    const line = {color: 'red'};
  return (
    <Polyline pathOptions={line} positions={polyline} />
  )
}

export default MyPolyline