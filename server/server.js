const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());


app.use('/avatars', express.static(path.join(__dirname, 'public/avatars'))); 


const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);


const tripRoutes = require('./routes/trips');
app.use('/api/trips', tripRoutes);


app.listen(3001, () => console.log("Server running on port 3001"));
