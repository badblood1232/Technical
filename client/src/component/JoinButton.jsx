
import React from 'react';
import { Button, Box } from '@mui/material';

const JoinButton = ({ trip, onJoin }) => {
  const isUpcoming = trip.status === 'Upcoming' && trip.current_heads < trip.max_heads;
  const isOngoing = trip.status === 'Ongoing';
  const isFull = trip.status === 'Full';

  return (
    <Box mt={2}>
      {isUpcoming ? (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onJoin(trip.id)}
        >
          Join
        </Button>
      ) : isOngoing ? null : (
        <Button variant="outlined" disabled fullWidth>
          {isFull ? 'Full' : 'Closed'}
        </Button>
      )}
    </Box>
  );
};

export default JoinButton;
