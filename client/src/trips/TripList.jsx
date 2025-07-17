import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/trips');
        setTrips(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load trips');
      }
    };

    fetchTrips();
  }, []);

  const handleJoin = async (tripId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to join a trip.');
        return;
      }
      await axios.post(`http://localhost:3001/api/trips/${tripId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Successfully joined the trip!');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to join trip');
    }
  };

  return (
    <div>
      <h2>All Trips</h2>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/my-trips">
            <button>My Trips</button>
        </Link>
    </div>

      {/* ✅ Create Trip Button */}
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/create-trip">
          <button style={{ padding: '0.5rem 1rem' }}>+ Add Trip</button>
        </Link>
      </div>

      {message && <p>{message}</p>}

      {trips.map((trip) => (
<div key={trip.id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  {trip.host_photo && (
    <img
      src={`http://localhost:3001/${trip.photo_path}`}
      alt="Host Avatar"
      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
    />
  )}
  <span style={{ fontStyle: 'italic' }}>Hosted by: {trip.host_name || 'Unknown'} and {trip.photo_path} </span>
</div>

  <h3>
    <Link to={`/trips/${trip.id}`}>{trip.title}</Link>
  </h3>
  <p>{trip.briefer}</p>
  <img src={trip.cover_photo} alt={trip.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
  <p><strong>Destination:</strong> {trip.destination_name}</p>
  <p><strong>Dates:</strong> {new Date(trip.start_time).toLocaleString()} - {new Date(trip.end_time).toLocaleString()}</p>
  <p><strong>Status:</strong> {trip.status}</p>
  <p><strong>Participants:</strong> {trip.current_heads} / {trip.max_heads}</p>
  {trip.status === 'Upcoming' && trip.current_heads < trip.max_heads ? (
    <button onClick={() => handleJoin(trip.id)}>Join</button>
  ) : (
    <button disabled>{trip.status === 'Full' ? 'Full' : 'Closed'}</button>
  )}
</div>

))}

    </div>
  );
}

export default TripList;
