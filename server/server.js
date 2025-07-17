const express = require('express');
const cors = require('cors');

const app = express();

// ✅ CORS setup (include frontend URL if needed)
app.use(cors({
  origin: 'http://localhost:5173', // your Vite frontend
  credentials: true
}));

app.use(express.json());

// ✅ Auth routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// ✅ Trip routes
const tripRoutes = require('./routes/trips');
app.use('/api/trips', tripRoutes); // this enables GET/POST /api/trips

// ✅ Start server
app.listen(3001, () => console.log("Server running on port 3001"));
