import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapContainer = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  const center = {
    lat: 14.6760,
    lng: 121.0437
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (!mapLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyBtAvIrnLAXJSpHE_m2JaGbaclSGZ2CFnk">
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={14}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
