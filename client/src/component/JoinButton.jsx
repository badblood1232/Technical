
import React from 'react';
import { Button, Box } from '@mui/material';

const JoinButton = ({ trip, onJoin }) => {
  const isUpcoming = trip.status === 'Upcoming' && trip.current_heads < trip.max_heads;
  const isFull = trip.status === 'Full';
  const isDisabled = trip.is_host || trip.already_joined || !isUpcoming;

  let label = 'Join';
  if (trip.is_host) label = 'You are the Host';
  else if (trip.already_joined) label = 'Already Joined';
  else if (isFull) label = 'Full';
  else if (!isUpcoming) label = 'Closed';

  return (
    <Box mt={2}>
      <Button
        variant={isDisabled ? "outlined" : "contained"}
        color="primary"
        fullWidth
        onClick={() => !isDisabled && onJoin(trip.id)}
        disabled={isDisabled}
      >
        {label}
      </Button>
    </Box>
  );
};
export default JoinButton;
