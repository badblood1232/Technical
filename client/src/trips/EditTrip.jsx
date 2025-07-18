import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
  Alert
} from '@mui/material';

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

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
        setIsError(true);
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
    setIsError(false);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/trips/${id}`, trip, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/trips/${id}`);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  if (!trip) {
    return (
      <Box p={4}>
        <Typography variant="body1">{message || 'Loading trip data...'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Trip
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            required
            margin="normal"
            value={trip.title}
            onChange={handleChange}
          />
          <TextField
            label="Brief Description"
            name="briefer"
            multiline
            rows={3}
            fullWidth
            required
            margin="normal"
            value={trip.briefer}
            onChange={handleChange}
          />
          <TextField
            label="Cover Photo URL"
            name="cover_photo"
            fullWidth
            margin="normal"
            value={trip.cover_photo}
            onChange={handleChange}
          />
          <TextField
            label="Destination Name"
            name="destination_name"
            fullWidth
            required
            margin="normal"
            value={trip.destination_name}
            onChange={handleChange}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Latitude"
              name="latitude"
              fullWidth
              required
              margin="normal"
              value={trip.latitude}
              onChange={handleChange}
            />
            <TextField
              label="Longitude"
              name="longitude"
              fullWidth
              required
              margin="normal"
              value={trip.longitude}
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
            value={trip.start_time}
            onChange={handleChange}
            inputProps={{
             max: trip.end_time || undefined
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
            value={trip.end_time}
            onChange={handleChange}
             inputProps={{
             min: trip.start_time || undefined
             }}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Minimum Participants"
              name="min_heads"
              type="number"
              fullWidth
              required
              margin="normal"
              value={trip.min_heads}
              onChange={handleChange}
            />
            <TextField
              label="Maximum Participants"
              name="max_heads"
              type="number"
              fullWidth
              required
              margin="normal"
              value={trip.max_heads}
              onChange={handleChange}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Save Changes
          </Button>
        </form>

        {message && (
          <Alert severity={isError ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        <Button
          component={Link}
          to={`/trips/${id}`}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          ← Back to Trip Detail
        </Button>
      </Paper>
    </Box>
  );
}

export default EditTrip;
