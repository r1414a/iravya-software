import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import { MOCK_TRIPS } from "@/constants/mock_trip_tracking";
import { useState, useEffect } from "react";


const dcIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1048/1048314.png",
    iconSize: [32, 32],
});

const storeIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
    iconSize: [30, 30],
});

const truckIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    iconSize: [36, 36],
});


export default function RenderingMap({tripData}) {
    if (!tripData) return null;
    const route = tripData.route || [];
    const actualRoute = tripData.actualRoute || [];
    const startPoint = route[0];
    const endPoint = route[route.length - 1];
    const currentLocation = actualRoute[actualRoute.length - 1] || startPoint;


  

    console.log(route, actualRoute, startPoint, endPoint, currentLocation);
    

    return (
        <MapContainer
            center={[currentLocation.lat, currentLocation.lng]}
            zoom={12}
            dragging={true}
            tap={true}
            touchZoom={true}
            scrollWheelZoom={true}
            style={{ height: "80vh", width: "100%", zIndex: 10 }} // Required: Map must have a defined height
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Planned Route */}
            <Polyline
                positions={route.map((p) => [p.lat, p.lng])}
            />

            {/* Actual Travel Path */}
            <Polyline
                positions={actualRoute.map((p) => [p.lat, p.lng])}
            />
            {/* DC Marker */}
            <Marker position={[startPoint.lat, startPoint.lng]} icon={dcIcon}>
                <Popup>🏭 Start DC: {startPoint.label}</Popup>
            </Marker>

            {/* Store Marker */}
            <Marker position={[endPoint.lat, endPoint.lng]} icon={storeIcon}>
                <Popup>🏬 Store: {endPoint.label}</Popup>
            </Marker>

            {/* Truck Marker */}
            <Marker position={[currentLocation.lat, currentLocation.lng]} icon={truckIcon}>
                <Popup>
                    🚚 Truck: {tripData.trip.truck}
                    <br />
                    Status: {tripData.trip.status}
                    <br />
                    Speed: {tripData.trip.speed}
                </Popup>
            </Marker>

            {/* Store Geofence */}
            <Circle
                center={[endPoint.lat, endPoint.lng]}
                radius={300}
            />
        </MapContainer>
    )
}