import React, { useState, useCallback } from 'react';
import { Modal } from 'antd';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const MapModal = ({ visible, onClose, onMarkerSelect }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const handleMapClick = useCallback((event) => {
    const { latLng } = event;
    const coords = { lat: latLng.lat(), lng: latLng.lng() };

    setSelectedMarker(coords);
    onMarkerSelect(coords);

    // Wait for the marker to be placed before closing the modal
    setTimeout(() => {
      onClose();
    }, 500); // Delay to ensure the marker is displayed
  }, [onMarkerSelect, onClose]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="80%"
      afterClose={() => setSelectedMarker(null)} // Reset marker on close
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={selectedMarker || { lat: 17.3526, lng: 78.5555 }} // Default center
        zoom={10}
        onClick={handleMapClick}
      >
        {selectedMarker && (
          <Marker position={selectedMarker} />
        )}
      </GoogleMap>
    </Modal>
  );
};

export default MapModal;
