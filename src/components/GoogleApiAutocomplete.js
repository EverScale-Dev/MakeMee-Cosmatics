"use client"
import React, { useRef, useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { TextField } from '@mui/material';

const libraries = ['places'];

const GoogleApiAutocomplete = ({ onAddressSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const autocompleteRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (place && place.address_components) {
      setErrorMessage(''); // Clear any existing error message if a valid place is selected

      // console.log("Address google", place.address_components);

      const addressComponents = {
        street_address1: place.formatted_address, 
        city: '',
        state: '',
        pincode: '',
        country: '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };

      place.address_components.forEach((component) => {
        const componentType = component.types[0];
        if (componentType === 'locality') {
          addressComponents.city = component.long_name;
        } else if (componentType === 'administrative_area_level_1') {
          addressComponents.state = component.long_name;
        } else if (componentType === 'postal_code') {
          addressComponents.pincode = component.long_name;
        } else if (componentType === 'country') {
          addressComponents.country = component.long_name;
        }
      });

      // Check if the place is in Maharashtra
      if (addressComponents.state === 'Maharashtra'||'महाराष्ट्र') {
        onAddressSelect(addressComponents);
        // console.log("address", addressComponents);
      } else {
        setErrorMessage('Invalid Address: Please select a location within Maharashtra.');
      }
    } else {
      // If no valid place is selected, set the error message
      setErrorMessage('Invalid Address: Please select a location from the suggestions.');
    }
  };

  return (
    <div>
      {isLoaded ? (
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
          options={{
            componentRestrictions: { country: 'IN' },
          }}
        >
          <TextField 
            label="Building Name / Locality / Area" 
            name="street_address1" 
            variant="outlined" 
            fullWidth 
            className="" 
            required 
            placeholder="Select location from suggestions"
            error={!!errorMessage}
            helperText={errorMessage || ' '}
          />
        </Autocomplete>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GoogleApiAutocomplete;
