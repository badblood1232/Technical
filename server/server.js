const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Import path module

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// ✅ Serve static files for avatars
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars'))); // ✅ NEW LINE

// ✅ Auth routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// ✅ Trip routes
const tripRoutes = require('./routes/trips');
app.use('/api/trips', tripRoutes);

// ✅ Start server
app.listen(3001, () => console.log("Server running on port 3001"));
