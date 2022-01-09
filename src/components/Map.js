import React from 'react'
import './Map.css';
import { Map as LeafletMap, TileLayer, Marker } from "react-leaflet"

function Map({countries, center, zoom}) {
    return (
        <div className = "map">
            <LeafletMap center = {center} zoom = {zoom}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=MRLnyJYqg1beSIpNudhO"
            />
            {/* loop through and draw circles */}
            </LeafletMap>           
        </div>
    )
}

export default Map;
