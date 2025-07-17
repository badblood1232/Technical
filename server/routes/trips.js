const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const db = require('../db');



const computeTripStatus = (trip) => {
  const now = new Date();
  const start = new Date(trip.start_time);

  if (trip.cancelled) return 'Cancelled';
  if (trip.current_heads >= trip.max_heads) return 'Full';
  if (now >= start) return 'Concluded';
  return 'Upcoming';
};

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


router.get('/my', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing token' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hostId = decoded.id;

    const [trips] = await db.query(
      "SELECT * FROM trips WHERE host_id = ? ORDER BY start_time DESC",
      [hostId]
    );

    const tripsWithStatus = trips.map((trip) => ({
      ...trip,
      status: computeTripStatus(trip)
    }));

    res.json(tripsWithStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



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



router.post('/:id/cancel', async (req, res) => {
  const tripId = req.params.id;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing token' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hostId = decoded.id;

   
    const [rows] = await db.query("SELECT host_id FROM trips WHERE id = ?", [tripId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Trip not found' });
    if (rows[0].host_id !== hostId) return res.status(403).json({ message: 'Unauthorized' });

  
    await db.query("UPDATE trips SET cancelled = TRUE WHERE id = ?", [tripId]);
    res.json({ message: "Trip cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing token' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hostId = decoded.id;

    const tripId = req.params.id;

  
    const [existing] = await db.query("SELECT * FROM trips WHERE id = ? AND host_id = ?", [tripId, hostId]);
    if (existing.length === 0) return res.status(403).json({ message: 'Unauthorized to edit this trip' });

    const {
      title, briefer, cover_photo, destination_name,
      latitude, longitude, start_time, end_time,
      min_heads, max_heads
    } = req.body;

    await db.query(`
      UPDATE trips SET 
        title = ?, briefer = ?, cover_photo = ?, destination_name = ?,
        latitude = ?, longitude = ?, start_time = ?, end_time = ?,
        min_heads = ?, max_heads = ?
      WHERE id = ?
    `, [
      title, briefer, cover_photo, destination_name,
      latitude, longitude, start_time, end_time,
      min_heads, max_heads, tripId
    ]);

    res.json({ message: 'Trip updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
