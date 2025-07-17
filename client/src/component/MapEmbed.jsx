import React from 'react';

function MapEmbed({ latitude, longitude }) {
  if (!latitude || !longitude) return <p>No coordinates provided.</p>;

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&output=embed`;

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4>Location Map</h4>
      <iframe
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title="Trip Location"
      ></iframe>
    </div>
  );
}

export default MapEmbed;
