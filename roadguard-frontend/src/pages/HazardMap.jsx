import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for severities
const getMarkerIcon = (severity) => {
    let color = '#3B82F6'; // Default Blue
    if (severity === 'High') color = '#EF4444'; // Red
    else if (severity === 'Medium') color = '#F59E0B'; // Orange
    else if (severity === 'Low') color = '#EAB308'; // Yellow

    // Create a custom SVG icon using Leaflet DivIcon
    const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32px" height="32px">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

    return L.divIcon({
        className: 'custom-div-icon',
        html: svgIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

// Center on Chennai, Tamil Nadu
const defaultCenter = [13.0827, 80.2707];

const MapController = ({ targetCenter }) => {
    const map = useMap();
    useEffect(() => {
        if (targetCenter) {
            map.flyTo(targetCenter, 15, { animate: true, duration: 1.5 });
        }
    }, [targetCenter, map]);
    return null;
};

const HazardMap = () => {
    const [hazards, setHazards] = useState([]);
    const [selectedHazard, setSelectedHazard] = useState(null);
    const [targetLocation, setTargetLocation] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch hazards from backend
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/hazards`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                // Filter out 'Resolved' hazards from public view
                setHazards(data.filter(h => h.status !== 'Resolved'));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="card" style={{ padding: '0', height: '70vh', position: 'relative' }}>
            <div className="map-sidebar">
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Live Hazard Intel</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Monitoring road infrastructure in real-time. Wait for repairs to confirm.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {loading ? (
                        <p style={{ color: '#64748B', textAlign: 'center', padding: '1rem' }}>Loading hazards...</p>
                    ) : hazards.length === 0 ? (
                        <p style={{ color: '#64748B', textAlign: 'center', padding: '1rem' }}>No hazards reported yet.</p>
                    ) : (
                        hazards.map((h, i) => (
                            <div
                                key={i}
                                onClick={() => setTargetLocation([h.latitude, h.longitude])}
                                style={{ padding: '0.75rem 0.5rem', background: '#F8F9FA', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '3px solid transparent', transition: '0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderLeftColor = 'var(--accent-orange)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#F8F9FA'; e.currentTarget.style.borderLeftColor = 'transparent'; }}
                                title="Click to view on map"
                            >
                                <span style={{ fontWeight: 600 }}>{h.hazard_type}</span>
                                <span className={`badge badge-${(h.severity_level || 'low').toLowerCase()}`}>{h.severity_level}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ width: '100%', height: '100%', borderRadius: '16px', zIndex: 1 }}
            >
                <MapController targetCenter={targetLocation} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hazards.map((hazard) => (
                    <Marker
                        key={hazard.id}
                        position={[hazard.latitude, hazard.longitude]}
                        icon={getMarkerIcon(hazard.severity_level)}
                        eventHandlers={{
                            click: () => setSelectedHazard(hazard),
                        }}
                    >
                        <Popup>
                            <div style={{ padding: '0.5rem', maxWidth: '200px', margin: 0 }}>
                                <img src={hazard.image_url} alt="Hazard" style={{ width: '100%', borderRadius: '4px', marginBottom: '0.5rem' }} />
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{hazard.hazard_type}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem' }}><strong>Severity:</strong> {hazard.severity_score}/10 ({hazard.severity_level})</p>
                                <p style={{ margin: 0, fontSize: '0.85rem' }}><strong>Status:</strong> {hazard.status}</p>
                                <button className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>
                                    Verify Repair
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default HazardMap;
