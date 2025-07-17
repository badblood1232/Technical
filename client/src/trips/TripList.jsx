import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from '../component/LogoutButton';
import MapEmbed from '../component/MapEmbed';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Alert,
  Paper,
  Stack
} from '@mui/material';

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
    <Box sx={{ padding: 4, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      <Paper sx={{ padding: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          All Trips
        </Typography>

        <Stack direction="row" spacing={2} mb={2}>
          <Button component={Link} to="/my-trips" variant="outlined">
            My Trips
          </Button>
          <Button component={Link} to="/create-trip" variant="contained">
            + Add Trip
          </Button>
          <LogoutButton />
        </Stack>

        {message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {trips.map((trip) => (
            <Grid item xs={12} md={6} lg={4} key={trip.id}>
              <Card>
                {trip.cover_photo && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={trip.cover_photo}
                    alt={trip.title}
                  />
                )}
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    {trip.host_photo && (
                      <Avatar
                        src={`http://localhost:3001/${trip.photo_path}`}
                        alt="Host"
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                    )}
                    <Typography variant="body2" fontStyle="italic">
                      Hosted by: {trip.host_name || 'Unknown'}
                    </Typography>
                  </Box>

                  <Typography variant="h6" component={Link} to={`/trips/${trip.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                    {trip.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {trip.briefer}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Destination:</strong> {trip.destination_name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dates:</strong>{' '}
                    {new Date(trip.start_time).toLocaleString()} –{' '}
                    {new Date(trip.end_time).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {trip.status}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Participants:</strong> {trip.current_heads} / {trip.max_heads}
                  </Typography>

                 
                  <MapEmbed latitude={trip.latitude} longitude={trip.longitude} />

                  <Box mt={2}>
                    {trip.status === 'Upcoming' && trip.current_heads < trip.max_heads ? (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleJoin(trip.id)}
                      >
                        Join
                      </Button>
                    ) : (
                      <Button variant="outlined" disabled fullWidth>
                        {trip.status === 'Full' ? 'Full' : 'Closed'}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

export default TripList;
