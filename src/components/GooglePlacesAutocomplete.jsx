import { useRef, useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const GooglePlacesAutocomplete = ({ onAddressSelect, placeholder = "Search for address..." }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (place && place.address_components) {
      setErrorMessage('');

      const addressComponents = {
        street: place.formatted_address,
        city: '',
        state: '',
        pincode: '',
        country: '',
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
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

      setInputValue(place.formatted_address);
      onAddressSelect(addressComponents);
    } else {
      setErrorMessage('Please select an address from the suggestions');
    }
  };

  if (loadError) {
    return (
      <div className="text-red-500 text-sm">
        Error loading Google Maps. Please check API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
        options={{
          componentRestrictions: { country: 'IN' },
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#731162]/30 ${
            errorMessage ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </Autocomplete>
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
