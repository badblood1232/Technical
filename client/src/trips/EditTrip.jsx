import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/trips/${id}`);
        const formatted = {
          ...res.data,
          start_time: res.data.start_time.slice(0, 16),
          end_time: res.data.end_time.slice(0, 16),
        };
        setTrip(formatted);
      } catch (err) {
        setMessage('Failed to fetch trip');
      }
    };
    fetchTrip();
  }, [id]);

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/trips/${id}`, trip, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/trips/${id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  if (!trip) return <p>{message || 'Loading...'}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Edit Trip</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input name="title" value={trip.title} onChange={handleChange} placeholder="Title" required />
        <textarea name="briefer" value={trip.briefer} onChange={handleChange} placeholder="Brief Description" rows={3} required />
        <input name="cover_photo" value={trip.cover_photo} onChange={handleChange} placeholder="Image URL" />
        <input name="destination_name" value={trip.destination_name} onChange={handleChange} placeholder="Destination Name" required />
        <input name="latitude" value={trip.latitude} onChange={handleChange} placeholder="Latitude" required />
        <input name="longitude" value={trip.longitude} onChange={handleChange} placeholder="Longitude" required />

        <label>
          Start Date & Time:
          <input type="datetime-local" name="start_time" value={trip.start_time} onChange={handleChange} required />
        </label>

        <label>
          End Date & Time:
          <input type="datetime-local" name="end_time" value={trip.end_time} onChange={handleChange} required />
        </label>

        <input name="min_heads" value={trip.min_heads} onChange={handleChange} placeholder="Minimum Participants" required />
        <input name="max_heads" value={trip.max_heads} onChange={handleChange} placeholder="Maximum Participants" required />

        <button type="submit">Save Changes</button>
      </form>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <Link to={`/trips/${id}`}><button style={{ marginTop: '1rem' }}>← Back to Trip Detail</button></Link>
    </div>
  );
}

export default EditTrip;
