import React, { useEffect, useRef } from 'react';

function MapPicker({ latitude, longitude, onChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude || 14.5995, lng: longitude || 120.9842 },
      zoom: 10,
    });

    const marker = new window.google.maps.Marker({
      position: { lat: latitude || 14.5995, lng: longitude || 120.9842 },
      map,
      draggable: true,
    });

    markerRef.current = marker;

    marker.addListener('dragend', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onChange({ latitude: lat, longitude: lng });
    });
  }, [latitude, longitude, onChange]);

  return (
    <div style={{ height: '300px', width: '100%', margin: '1rem 0' }} ref={mapRef}></div>
  );
}

export default MapPicker;
