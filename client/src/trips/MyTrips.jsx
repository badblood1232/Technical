import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CancelTripButton from '../component/CancelTripButton';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  Card,
  CardContent,
  Stack
} from '@mui/material';

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
    <Box sx={{ padding: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper sx={{ padding: 3, maxWidth: 1000, mx: 'auto' }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            My Hosted Trips
          </Typography>
          <Button component={Link} to="/trips" variant="outlined">
            ← Back to Trip List
          </Button>
        </Stack>

        {message && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {trips.length === 0 ? (
          <Typography variant="body1">No trips found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {trips.filter((trip) => !trip.cancelled).map((trip) => (
              <Grid item xs={12} md={6} key={trip.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {trip.title}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Status:</strong> {trip.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Participants:</strong> {trip.current_heads} / {trip.max_heads}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Start:</strong> {new Date(trip.start_time).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>End:</strong> {new Date(trip.end_time).toLocaleString()}
                    </Typography>

                    <Stack direction="row" spacing={1} mt={2}>
                      <CancelTripButton
                        tripId={trip.id}
                        onCancelSuccess={() => setTrips(trips.filter(t => t.id !== trip.id))}
                      />

                      <Button
                        component={Link}
                        to={`/trips/${trip.id}/edit`}
                        variant="outlined"
                      >
                        Edit
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

export default MyTrips;
