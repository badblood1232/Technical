import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/trips/${id}`);
        setTrip(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load trip details');
      }
    };

    fetchTrip();
  }, [id]);

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return setMessage('Please log in to join this trip.');

      await axios.post(`http://localhost:3001/api/trips/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Successfully joined the trip!');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to join trip');
    }
  };

  if (!trip) return <p>{message || 'Loading trip...'}</p>;

  return (
    <div>
      <h2>{trip.title}</h2>
      <p>{trip.briefer}</p>
      <img src={trip.cover_photo} alt={trip.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
      <p><strong>Destination:</strong> {trip.destination_name}</p>
      <p><strong>Coordinates:</strong> {trip.latitude}, {trip.longitude}</p>
      <p><strong>Dates:</strong> {new Date(trip.start_time).toLocaleString()} - {new Date(trip.end_time).toLocaleString()}</p>
      <p><strong>Status:</strong> {trip.status}</p>
      <p><strong>Participants:</strong> {trip.current_heads} / {trip.max_heads}</p>

      {trip.status === 'Upcoming' && trip.current_heads < trip.max_heads ? (
        <button onClick={handleJoin}>Join Trip</button>
      ) : (
        <button disabled>{trip.status === 'Full' ? 'Full' : 'Closed'}</button>
      )}

      {message && <p>{message}</p>}

      <p><Link to="/trips">Back to Trip List</Link></p>
    </div>
  );
}

export default TripDetail;