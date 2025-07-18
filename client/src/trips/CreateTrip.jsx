import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Stack
} from '@mui/material';

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
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/trips', tripData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Trip created successfully!');
      setTripData({
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

      setTimeout(() => navigate('/trips'), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Trip creation failed');
      setIsError(true);
    }
  };



  return (
    <Box sx={{ padding: 4, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Paper sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create a New Trip
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            required
            margin="normal"
            value={tripData.title}
            onChange={handleChange}
          />

          <TextField
            label="Briefer"
            name="briefer"
            multiline
            rows={3}
            fullWidth
            required
            margin="normal"
            value={tripData.briefer}
            onChange={handleChange}
          />

          <TextField
            label="Cover Photo URL"
            name="cover_photo"
            fullWidth
            required
            margin="normal"
            value={tripData.cover_photo}
            onChange={handleChange}
          />

          <TextField
            label="Destination Name"
            name="destination_name"
            fullWidth
            required
            margin="normal"
            value={tripData.destination_name}
            onChange={handleChange}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Latitude"
              name="latitude"
              fullWidth
              margin="normal"
              value={tripData.latitude}
              onChange={handleChange}
            />
            <TextField
              label="Longitude"
              name="longitude"
              fullWidth
              margin="normal"
              value={tripData.longitude}
              onChange={handleChange}
            />
          </Stack>

          <TextField
            label="Start Time"
            name="start_time"
            type="datetime-local"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={tripData.start_time}
            onChange={handleChange}
            inputProps={{
             max: tripData.end_time || undefined
             }}
          />

          <TextField
            label="End Time"
            name="end_time"
            type="datetime-local"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={tripData.end_time}
            onChange={handleChange}
            inputProps={{
            min: tripData.start_time || undefined
             }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Min Participants"
              name="min_heads"
              type="number"
              fullWidth
              required
              margin="normal"
              value={tripData.min_heads}
              onChange={handleChange}
            />
            <TextField
              label="Max Participants"
              name="max_heads"
              type="number"
              fullWidth
              required
              margin="normal"
              value={tripData.max_heads}
              onChange={handleChange}
            />
          </Stack>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 3 }}
          >
            Create Trip
          </Button>

          <Button
            variant="outlined"
            fullWidth
            component={Link}
            to="/trips"
            sx={{ mt: 2 }}
          >
            Back
          </Button>
        </form>

        {message && (
          <Alert severity={isError ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}

export default CreateTrip;

