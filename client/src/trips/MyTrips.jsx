import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CancelTripButton from '../component/CancelTripButton';

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMyTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/trips/my', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTrips(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load your trips.');
      }
    };

    fetchMyTrips();
  }, []);

  return (
    <div>
      <h2>My Hosted Trips</h2>

      <Link to="/trips">
        <button style={{ marginBottom: '1rem' }}>← Back to Trip List</button>
      </Link>

      {message && <p>{message}</p>}

      {trips.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        trips.filter((trip) => !trip.cancelled).map((trip) => (
          <div key={trip.id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
            <h3>{trip.title}</h3>
            <p><strong>Status:</strong> {trip.status}</p>
            <p><strong>Participants:</strong> {trip.current_heads} / {trip.max_heads}</p>
            <p><strong>Start:</strong> {new Date(trip.start_time).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(trip.end_time).toLocaleString()}</p>
            <CancelTripButton
              tripId={trip.id}
              onCancelSuccess={() => setTrips(trips.filter(t => t.id !== trip.id))}
             />
           
            <Link to={`/trips/${trip.id}/edit`}>
              <button>Edit</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default MyTrips;
