import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 33.5731, // Casablanca default
  lng: -7.5898
};

const MapComponent = ({ address, city, lat, lng, onLocationSelect }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      if (lat && lng) {
        const exactLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
        setCenter(exactLocation);
        setMarkerPosition(exactLocation);
      } else if (address || city) {
        const geocoder = new window.google.maps.Geocoder();
        const searchQuery = `${address ? address + ', ' : ''}${city || ''}`;
        
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const newCenter = { lat: location.lat(), lng: location.lng() };
            setCenter(newCenter);
            setMarkerPosition(newCenter);
          }
        });
      }
    }
  }, [isLoaded, address, city, lat, lng]);

  const handleMapClick = (e) => {
    if (onLocationSelect) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      onLocationSelect(lat, lng);
    }
  };

  if (loadError) {
    return <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onClick={handleMapClick}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        draggableCursor: onLocationSelect ? 'crosshair' : 'grab'
      }}
    >
      {markerPosition && (
        <Marker position={markerPosition} />
      )}
    </GoogleMap>
  );
};

export default React.memo(MapComponent);
