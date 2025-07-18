import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';

function JoinedTrips() {
  const [joinedTrips, setJoinedTrips] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJoinedTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/trips/joined', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setJoinedTrips(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load joined trips.');
      }
    };

    fetchJoinedTrips();
  }, []);

  if (message) {
    return <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>;
  }

  if (joinedTrips.length === 0) {
    return <Typography>No joined trips found.</Typography>;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>Joined Trips</Typography>
      <Grid container spacing={3}>
        {joinedTrips.map(trip => (
          <Grid item xs={12} md={6} key={trip.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{trip.title}</Typography>
                <Typography variant="body2"><strong>Status:</strong> {trip.status}</Typography>
                <Typography variant="body2"><strong>Participants:</strong> {trip.current_heads} / {trip.max_heads}</Typography>
                <Typography variant="body2"><strong>Start:</strong> {new Date(trip.start_time).toLocaleString()}</Typography>
                <Typography variant="body2"><strong>End:</strong> {new Date(trip.end_time).toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ color: trip.cancelled ? 'red' : 'inherit' }}>
                 {trip.cancelled ? 'This trip was cancelled.' : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default JoinedTrips;
