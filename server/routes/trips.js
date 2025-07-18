const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

const computeTripStatus = (trip) => {
  const now = new Date();
  const start = new Date(trip.start_time);
  const end = new Date(trip.end_time);

  if (trip.cancelled) return 'Cancelled';
  if (trip.current_heads >= trip.max_heads) return 'Full';
  if (now > end) return 'Concluded';
  if (now >= start) return 'Ongoing';
  return 'Upcoming';
};


router.get('/', async (req, res) => {
  try {
    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.warn('Invalid token');
      }
    }

    const [trips] = await db.query(`
      SELECT trips.*, users.username AS host_name, users.photo_path AS host_photo
      FROM trips
      JOIN users ON trips.host_id = users.id
      ORDER BY trips.start_time DESC
    `);

    const tripsWithStatus = await Promise.all(trips.map(async (trip) => {
      let already_joined = false;

      if (userId) {
        const [participantRows] = await db.query(
          'SELECT 1 FROM trip_participants WHERE user_id = ? AND trip_id = ?',
          [userId, trip.id]
        );
        already_joined = participantRows.length > 0;
      }

      return {
        ...trip,
        status: computeTripStatus(trip),
        is_host: userId === trip.host_id,
        already_joined,
      };
    }));

    res.json(tripsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/my', authMiddleware, async (req, res) => {
  try {
    const hostId = req.user.id;

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
    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.warn('Invalid token');
      }
    }

    const [rows] = await db.query(`
      SELECT trips.*, users.username AS host_name, users.photo_path AS host_photo
      FROM trips
      JOIN users ON trips.host_id = users.id
      WHERE trips.id = ?
    `, [tripId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const trip = rows[0];
    trip.status = computeTripStatus(trip);
    trip.is_host = userId === trip.host_id;

    if (userId) {
      const [joined] = await db.query(
        'SELECT 1 FROM trip_participants WHERE user_id = ? AND trip_id = ?',
        [userId, tripId]
      );
      trip.already_joined = joined.length > 0;
    } else {
      trip.already_joined = false;
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  try {
    const host_id = req.user.id;
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


router.post('/:id/cancel', authMiddleware, async (req, res) => {
  const tripId = req.params.id;
  try {
    const hostId = req.user.id;

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


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const hostId = req.user.id;
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


router.post('/:tripId/join', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const tripId = req.params.tripId;

    const [tripRows] = await db.query(
      "SELECT * FROM trips WHERE id = ? AND cancelled = FALSE",
      [tripId]
    );
    if (!tripRows.length) {
      return res.status(404).json({ message: "Trip not found or cancelled" });
    }

    const trip = tripRows[0];

    if (trip.current_heads >= trip.max_heads) {
      return res.status(400).json({ message: "Trip is full" });
    }

    if (trip.host_id === userId) {
      return res.status(400).json({ message: "Host cannot join their own trip" });
    }

    const [existingParticipant] = await db.query(
      "SELECT * FROM trip_participants WHERE user_id = ? AND trip_id = ?",
      [userId, tripId]
    );

    if (existingParticipant.length > 0) {
      return res.status(400).json({ message: "User already joined this trip" });
    }

    await db.query(
      "INSERT INTO trip_participants (user_id, trip_id) VALUES (?, ?)",
      [userId, tripId]
    );

    await db.query(
      "UPDATE trips SET current_heads = current_heads + 1 WHERE id = ?",
      [tripId]
    );

    return res.json({ message: "Joined trip successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
