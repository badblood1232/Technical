const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const safeName = `user_${Date.now()}${ext}`;
    cb(null, safeName);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/bmp', 'image/png', 'image/jpeg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .bmp, .png, and .jpeg files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        photo_path: user.photo_path,
        mantra: user.mantra
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    const { username, mantra, email, password } = req.body;

   
    const photo_path = req.file ? `/uploads/${req.file.filename}` : null;

   
    const [check] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (check.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

   
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, mantra, email, password_hash, photo_path) VALUES (?, ?, ?, ?, ?)",
      [username, mantra, email, hash, photo_path]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
