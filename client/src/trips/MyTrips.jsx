import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CancelTripButton from '../component/CancelTripButton';
import JoinedTrips from './JoinedTrip';
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
  const [hostedTrips, setHostedTrips] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchHostedTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/trips/my', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setHostedTrips(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load your hosted trips.');
      }
    };

    fetchHostedTrips();
  }, []);

  return (
    <Box sx={{ padding: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper sx={{ padding: 3, maxWidth: 1000, mx: 'auto' }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            My Trips
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

        <Typography variant="h5" gutterBottom>Hosted Trips</Typography>
        {hostedTrips.length === 0 ? (
          <Typography>No hosted trips found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {hostedTrips.map(trip => (
              <Grid item xs={12} md={6} key={trip.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{trip.title}</Typography>
                    <Typography variant="body2"><strong>Status:</strong> {trip.status}</Typography>
                    <Typography variant="body2"><strong>Participants:</strong> {trip.current_heads} / {trip.max_heads}</Typography>
                    <Typography variant="body2"><strong>Start:</strong> {new Date(trip.start_time).toLocaleString()}</Typography>
                    <Typography variant="body2"><strong>End:</strong> {new Date(trip.end_time).toLocaleString()}</Typography>
                    <Stack direction="row" spacing={1} mt={2}>
                      <CancelTripButton
                        tripId={trip.id}
                        disabled={trip.cancelled}
                        onCancelSuccess={() =>
                          setHostedTrips(hostedTrips.map(t => t.id === trip.id ? { ...t, cancelled: true } : t))
                        }
                      />
                      <Button
                        component={Link}
                        to={`/trips/${trip.id}/edit`}
                        variant="outlined"
                        disabled={trip.cancelled}
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

        <Box mt={5}>
          <JoinedTrips />
        </Box>
      </Paper>
    </Box>
  );
}

export default MyTrips;
