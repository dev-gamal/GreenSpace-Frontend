import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultCenter = [33.5731, -7.5898];

const LocationSelector = ({ onLocationSelect, setMarkerPosition }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setMarkerPosition([lat, lng]);
        onLocationSelect(lat, lng);
      }
    },
  });
  return null;
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ address, city, lat, lng, onLocationSelect }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (lat && lng) {
      const exactLocation = [parseFloat(lat), parseFloat(lng)];
      setCenter(exactLocation);
      setMarkerPosition(exactLocation);
    } else if (address || city) {
      const searchQuery = `${address ? address + ', ' : ''}${city || ''}`;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const newCenter = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            setCenter(newCenter);
            setMarkerPosition(newCenter);
          }
        })
        .catch(err => console.error("Error geocoding with Nominatim:", err));
    }
  }, [address, city, lat, lng]);

  return (
    <div style={{ width: '100%', height: '100%', zIndex: 1 }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        {onLocationSelect && <LocationSelector onLocationSelect={onLocationSelect} setMarkerPosition={setMarkerPosition} />}
        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>
    </div>
  );
};

export default React.memo(MapComponent);
