import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Typography, Button, Alert, Paper, Stack } from '@mui/material';

function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!data.email || !data.password) {
      setMessage('Please enter both email and password.');
      setIsError(true);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/trips'), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setMessage(msg);
      setIsError(true);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleClick}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Stack spacing={2} mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
            <Button component={Link} to="/register" variant="outlined" fullWidth>
            Register
          </Button>
          </Stack>
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

export default Login;
