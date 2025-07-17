import{ useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Paper, Stack } from '@mui/material';

function Register() {
  const [data, setData] = useState({ username: '', mantra: '', email: '', password: '', photo: null });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setData({ ...data, photo: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!data.username || !data.email || !data.password) {
      setMessage('Please fill in all required fields.');
      setIsError(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('mantra', data.mantra);
      formData.append('email', data.email);
      formData.append('photo', data.photo);
      formData.append('password', data.password);
      formData.append('photo_path', data.photo?.name || '');

      await axios.post('http://localhost:3001/api/register', formData);

      setMessage('Registration successful!');
      setData({ username: '', mantra: '', email: '', password: '', photo: null });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setMessage(msg);
      setIsError(true);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ padding: 4, width: 500 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleClick} encType="multipart/form-data">
          <TextField label="Username" name="username" fullWidth required margin="normal" value={data.username} onChange={handleChange} />
          <TextField label="Mantra" name="mantra" fullWidth margin="normal" value={data.mantra} onChange={handleChange} />
          <TextField label="Email" name="email" type="email" fullWidth required margin="normal" value={data.email} onChange={handleChange} />
          <TextField label="Password" name="password" type="password" fullWidth required margin="normal" value={data.password} onChange={handleChange} />
          <Button variant="outlined" component="label" sx={{ mt: 2, mb: 2 }} fullWidth>
            Upload Photo (.bmp)
            <input type="file" name="photo" accept=".bmp" hidden onChange={handleChange} />
          </Button>
          <Stack spacing={2}>
            <Button variant="contained" type="submit" fullWidth>
              Register
            </Button>
            <Button
                component={Link}
                to="/"
                variant="outlined"
                fullWidth
                >
                 Back to Login
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

export default Register;