import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [tripData, setTripData] = useState({
    title: '',
    briefer: '',
    cover_photo: '',
    destination_name: '',
    latitude: '',
    longitude: '',
    start_time: '',
    end_time: '',
    min_heads: '',
    max_heads: ''
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3001/api/trips', tripData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Trip created successfully!');
      setTripData({
        title: '', briefer: '', cover_photo: '', destination_name: '',
        latitude: '', longitude: '', start_time: '', end_time: '',
        min_heads: '', max_heads: ''
      });
      navigate('/trips');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Trip creation failed');
    }
  };

  return (
    <div>
      <h2>Create a New Trip</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={tripData.title} onChange={handleChange} required /><br />
        <textarea name="briefer" placeholder="Briefer" value={tripData.briefer} onChange={handleChange} required /><br />
        <input name="cover_photo" placeholder="Cover Photo URL" value={tripData.cover_photo} onChange={handleChange} required /><br />
        <input name="destination_name" placeholder="Destination Name" value={tripData.destination_name} onChange={handleChange} required /><br />
        <input name="latitude" placeholder="Latitude" value={tripData.latitude} onChange={handleChange} /><br />
        <input name="longitude" placeholder="Longitude" value={tripData.longitude} onChange={handleChange} /><br />
        <label>Start Time:</label>
        <input name="start_time" type="datetime-local" value={tripData.start_time} onChange={handleChange} required /><br />
        <label>End Time:</label>
        <input name="end_time" type="datetime-local" value={tripData.end_time} onChange={handleChange} required /><br />
        <input name="min_heads" type="number" placeholder="Min Participants" value={tripData.min_heads} onChange={handleChange} required /><br />
        <input name="max_heads" type="number" placeholder="Max Participants" value={tripData.max_heads} onChange={handleChange} required /><br />
        <button type="submit">Create Trip</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateTrip;
