const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // ✅ Fix added
const db = require('../db');


// Helper to assign status based on trip data
const computeTripStatus = (trip) => {
  const now = new Date();
  const start = new Date(trip.start_time);

  if (trip.cancelled) return 'Cancelled';
  if (trip.current_heads >= trip.max_heads) return 'Full';
  if (now >= start) return 'Concluded';
  return 'Upcoming';
};

// GET all trips
router.get('/', async (req, res) => {
  try {
    const [trips] = await db.query("SELECT * FROM trips ORDER BY start_time DESC");

    const tripsWithStatus = trips.map((trip) => ({
      ...trip,
      status: computeTripStatus(trip)
    }));

    res.json(tripsWithStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET trip by ID
router.get('/:id', async (req, res) => {
  const tripId = req.params.id;
  try {
    const [rows] = await db.query("SELECT * FROM trips WHERE id = ?", [tripId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const trip = rows[0];
    trip.status = computeTripStatus(trip);

    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // ✅ Extract token and decode to get host_id
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const host_id = decoded.id;

    const {
      title, briefer, cover_photo, destination_name,
      latitude, longitude, start_time, end_time,
      min_heads, max_heads
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO trips 
        (title, briefer, cover_photo, destination_name, latitude, longitude, start_time, end_time, min_heads, max_heads, current_heads, cancelled, host_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, false, ?)`,
      [title, briefer, cover_photo, destination_name, latitude, longitude, start_time, end_time, min_heads, max_heads, host_id]
    );

    res.status(201).json({ message: 'Trip created', tripId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST to cancel a trip
router.post('/:id/cancel', async (req, res) => {
  const tripId = req.params.id;
  try {
    await db.query("UPDATE trips SET cancelled = TRUE WHERE id = ?", [tripId]);
    res.json({ message: "Trip cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
