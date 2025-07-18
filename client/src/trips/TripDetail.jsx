import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MapEmbed from '../component/MapEmbed';
import JoinButton from '../component/JoinButton';
import TripPeopleSection from './TripPeopleSection';

import {
  Box,
  Typography,
  Button,
  CardContent,
  CardMedia,
  Alert,
  Paper,
  Stack
} from '@mui/material';

function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [message, setMessage] = useState('');

  const fetchTrip = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrip(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load trip details');
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleJoin = async (tripId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to join a trip.');
        return;
      }

      await axios.post(
        `http://localhost:3001/api/trips/${tripId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('Successfully joined the trip!');
      await fetchTrip(); // refresh trip data to update button
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to join trip');
    }
  };

  if (!trip) {
    return (
      <Box p={4}>
        <Typography variant="body1">
          {message || 'Loading trip...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
        <Stack direction="row" spacing={2} mb={2}>
          <Button component={Link} to="/trips" variant="outlined">
            ← Back to Trip List
          </Button>
        </Stack>

        <Typography variant="h4" gutterBottom>
          {trip.title}
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={2}>
          {trip.briefer}
        </Typography>

        {trip.cover_photo && (
          <CardMedia
            component="img"
            height="300"
            image={trip.cover_photo}
            alt={trip.title}
            sx={{ objectFit: 'cover', borderRadius: 1, mb: 2 }}
          />
        )}

        <CardContent>
          <Typography variant="body1"><strong>Destination:</strong> {trip.destination_name}</Typography>
          <Typography variant="body1"><strong>Coordinates:</strong> {trip.latitude}, {trip.longitude}</Typography>
          <Typography variant="body1">
            <strong>Dates:</strong> {new Date(trip.start_time).toLocaleString()} – {new Date(trip.end_time).toLocaleString()}
          </Typography>
          <Typography variant="body1"><strong>Status:</strong> {trip.status}</Typography>
          <Typography variant="body1" mb={2}>
            <strong>Participants:</strong> {trip.current_heads} / {trip.max_heads}
          </Typography>
          <TripPeopleSection
            host_name={trip.host_name}
            host_photo={trip.host_photo}
            joiners={trip.joiners}
          />


          <MapEmbed latitude={trip.latitude} longitude={trip.longitude} />
          <JoinButton trip={trip} onJoin={handleJoin} />
          {message && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </CardContent>
      </Paper>
    </Box>
  );
}

export default TripDetail;
