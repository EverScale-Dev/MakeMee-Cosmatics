// components/MapWithMarker.js
import React, { useState, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const MapWithMarker = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Replace with your Google Maps API key
    libraries,
  });

  const [markerPosition, setMarkerPosition] = useState({ lat: 37.7749, lng: -122.4194 }); // Default location
  const [address, setAddress] = useState("");
  const mapRef = useRef(null);

  // Update address when marker position changes
  const handleMarkerDragEnd = async (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });

    // Fetch address using Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.results && data.results[0]) {
      setAddress(data.results[0].formatted_address);
      console.log("Address:", data.results[0].formatted_address);
    } else {
      setAddress("Address not found");
      console.log("Address not found");
    }
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        center={markerPosition}
        zoom={14}
        mapContainerStyle={{ width: '100%', height: '400px' }}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
      <div>
        <h2>Marker Address:</h2>
        <p>{address}</p>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default MapWithMarker;
