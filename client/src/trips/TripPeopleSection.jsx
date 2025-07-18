import React from 'react';
import { Box, Typography } from '@mui/material';

function TripPeopleSection({ host_name, host_photo, joiners = [] }) {
  return (
    <>
     
      <Typography variant="h6" mt={4}>Host</Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <img
          src={host_photo ? `http://localhost:3001/${host_photo}` : '/default-avatar.png'}
          alt={host_name}
          width={40}
          height={40}
          style={{ borderRadius: '50%', marginRight: 8 }}
        />
        <Typography>{host_name}</Typography>
      </Box>

      
      <Typography variant="h6" mt={4}>Joiners</Typography>
      {joiners.length === 0 ? (
        <Typography variant="body2">No joiners yet.</Typography>
      ) : (
        <Box>
          {joiners.map((user) => (
            <Box key={user.id} display="flex" alignItems="center" mb={1}>
              <img
                src={user.photo_path ? `http://localhost:3001/${user.photo_path}` : '/default-avatar.png'}
                alt={user.username}
                width={30}
                height={30}
                style={{ borderRadius: '50%', marginRight: 8 }}
              />
              <Typography variant="body2">{user.username}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}

export default TripPeopleSection;
