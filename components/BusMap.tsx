import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon
const busIcon = new L.DivIcon({
    className: 'custom-bus-icon',
    html: `<div style="background-color: #EAB308; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; items-center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <span style="font-size: 14px;">🚌</span>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Component to recenter map when props change
const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 14);
    }, [center, map]);
    return null;
};

interface BusMapProps {
    stops: { lat: number; lng: number; name: string; status: 'pending' | 'arrived' | 'departed' }[];
    currentBusPosition?: { lat: number; lng: number };
}

const BusMap: React.FC<BusMapProps> = ({ stops, currentBusPosition }) => {
    // Default center (Bangalore) if no stops
    const center: [number, number] = currentBusPosition
        ? [currentBusPosition.lat, currentBusPosition.lng]
        : (stops.length > 0 ? [stops[0].lat, stops[0].lng] : [12.9716, 77.5946]);

    const routePositions: [number, number][] = stops.map(s => [s.lat, s.lng]);

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-[var(--dash-border)] relative z-0">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Route Line */}
                <Polyline positions={routePositions} color="#6366f1" weight={4} opacity={0.7} />

                {/* Stops */}
                {stops.map((stop, idx) => (
                    <Marker key={idx} position={[stop.lat, stop.lng]}>
                        <Popup>{stop.name} <br /> Status: {stop.status}</Popup>
                    </Marker>
                ))}

                {/* Live Bus */}
                {currentBusPosition && (
                    <Marker position={[currentBusPosition.lat, currentBusPosition.lng]} icon={busIcon} zIndexOffset={100}>
                        <Popup>Live Bus Location</Popup>
                    </Marker>
                )}

                <RecenterMap center={center} />
            </MapContainer>
        </div>
    );
};

export default BusMap;
