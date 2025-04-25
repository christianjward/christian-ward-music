// This file serves as a serverless function entry point for your Express app
const serverless = require('serverless-http');
const express = require('express');
const { storage } = require('../../server/storage');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up file storage for multer
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage_config });

// Basic authentication middleware
const basicAuth = (req, res, next) => {
  // Skip auth for non-admin routes
  if (!req.path.includes('/api/admin') && 
      !req.path.includes('/api/tracks/create') &&
      !req.path.includes('/api/tracks/update') &&
      !req.path.includes('/api/tracks/delete')) {
    return next();
  }

  // Check for basic auth header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // Verify credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Get user from storage
  storage.getUserByUsername(username)
    .then(user => {
      if (!user || user.password !== password || !user.isAdmin) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      req.user = user;
      next();
    })
    .catch(err => {
      console.error('Auth error:', err);
      res.status(500).json({ error: 'Server error during authentication' });
    });
};

// Create a minimal version of the Express app for serverless
const app = express();
app.use(express.json());
app.use(basicAuth);

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Track routes
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await storage.getTracks();
    res.json(tracks);
  } catch (err) {
    console.error('Error fetching tracks:', err);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

app.get('/api/tracks/featured', async (req, res) => {
  try {
    const tracks = await storage.getFeaturedTracks();
    res.json(tracks);
  } catch (err) {
    console.error('Error fetching featured tracks:', err);
    res.status(500).json({ error: 'Failed to fetch featured tracks' });
  }
});

app.get('/api/tracks/genre/:genre', async (req, res) => {
  try {
    const tracks = await storage.getTracksByGenre(req.params.genre);
    res.json(tracks);
  } catch (err) {
    console.error('Error fetching tracks by genre:', err);
    res.status(500).json({ error: 'Failed to fetch tracks by genre' });
  }
});

app.get('/api/tracks/mood/:mood', async (req, res) => {
  try {
    const tracks = await storage.getTracksByMood(req.params.mood);
    res.json(tracks);
  } catch (err) {
    console.error('Error fetching tracks by mood:', err);
    res.status(500).json({ error: 'Failed to fetch tracks by mood' });
  }
});

app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await storage.getTrack(parseInt(req.params.id));
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (err) {
    console.error('Error fetching track:', err);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

app.post('/api/tracks/create', upload.single('audioFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const fileName = req.file.filename;
    const track = {
      ...req.body,
      fileName,
      bpm: req.body.bpm ? parseInt(req.body.bpm) : null,
      featured: req.body.featured === 'true',
    };

    const newTrack = await storage.createTrack(track);
    res.status(201).json(newTrack);
  } catch (err) {
    console.error('Error creating track:', err);
    res.status(500).json({ error: 'Failed to create track' });
  }
});

app.put('/api/tracks/update/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const track = await storage.getTrack(id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const updatedTrack = await storage.updateTrack(id, {
      ...req.body,
      bpm: req.body.bpm ? parseInt(req.body.bpm) : null,
      featured: req.body.featured === true || req.body.featured === 'true',
    });

    res.json(updatedTrack);
  } catch (err) {
    console.error('Error updating track:', err);
    res.status(500).json({ error: 'Failed to update track' });
  }
});

app.delete('/api/tracks/delete/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const track = await storage.getTrack(id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    // Delete the file if it exists
    if (track.fileName) {
      const filePath = path.join(uploadsDir, track.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    const result = await storage.deleteTrack(id);
    if (result) {
      res.status(200).json({ message: 'Track deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete track' });
    }
  } catch (err) {
    console.error('Error deleting track:', err);
    res.status(500).json({ error: 'Failed to delete track' });
  }
});

// Genre routes
app.get('/api/genres', async (req, res) => {
  try {
    const genres = await storage.getGenres();
    res.json(genres);
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Mood routes
app.get('/api/moods', async (req, res) => {
  try {
    const moods = await storage.getMoods();
    res.json(moods);
  } catch (err) {
    console.error('Error fetching moods:', err);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// Auth routes
app.get('/api/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Export the handler function for Netlify Functions
module.exports.handler = serverless(app);