import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertTrackSchema, insertGenreSchema, insertMoodSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Set up multer storage for track uploads
const storage_dir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(storage_dir)) {
  fs.mkdirSync(storage_dir, { recursive: true });
}

const trackStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, storage_dir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: trackStorage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'audio/mpeg') {
      return cb(new Error('Only MP3 files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Middleware to validate admin
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // In a real app, we would check session/authentication
  // For simplicity, we'll use a header
  const adminToken = req.headers['admin-token'];
  
  if (adminToken === 'admin123') {
    return next();
  }
  
  return res.status(403).json({ message: 'Access denied' });
};

// Error handling middleware
const handleZodError = (err: unknown, res: Response) => {
  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({ message: validationError.message });
  }
  
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  
  return res.status(500).json({ message: 'An unknown error occurred' });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded track files
  app.use('/api/tracks/stream', express.static(storage_dir));
  
  // Track Routes
  app.get('/api/tracks', async (_req, res) => {
    try {
      const tracks = await storage.getTracks();
      res.json(tracks);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching tracks' });
    }
  });
  
  app.get('/api/tracks/featured', async (_req, res) => {
    try {
      const featuredTracks = await storage.getFeaturedTracks();
      res.json(featuredTracks);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching featured tracks' });
    }
  });
  
  app.get('/api/tracks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const track = await storage.getTrack(id);
      
      if (!track) {
        return res.status(404).json({ message: 'Track not found' });
      }
      
      res.json(track);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching track' });
    }
  });
  
  app.post('/api/tracks', requireAdmin, upload.single('audioFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Audio file is required' });
      }
      
      const fileName = req.file.filename;
      const trackData = insertTrackSchema.parse({
        ...req.body,
        fileName,
        bpm: req.body.bpm ? parseInt(req.body.bpm) : undefined,
        featured: req.body.featured === 'true'
      });
      
      const newTrack = await storage.createTrack(trackData);
      res.status(201).json(newTrack);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  app.put('/api/tracks/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const track = await storage.getTrack(id);
      
      if (!track) {
        return res.status(404).json({ message: 'Track not found' });
      }
      
      const updateData = {
        ...req.body,
        bpm: req.body.bpm ? parseInt(req.body.bpm) : undefined,
        featured: req.body.featured === 'true' || req.body.featured === true
      };
      
      const updatedTrack = await storage.updateTrack(id, updateData);
      res.json(updatedTrack);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  app.delete('/api/tracks/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const track = await storage.getTrack(id);
      
      if (!track) {
        return res.status(404).json({ message: 'Track not found' });
      }
      
      await storage.deleteTrack(id);
      
      // Delete the file
      const filePath = path.join(storage_dir, track.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: 'Error deleting track' });
    }
  });
  
  // Genre Routes
  app.get('/api/genres', async (_req, res) => {
    try {
      const genres = await storage.getGenres();
      res.json(genres);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching genres' });
    }
  });
  
  app.post('/api/genres', requireAdmin, async (req, res) => {
    try {
      const genreData = insertGenreSchema.parse(req.body);
      const newGenre = await storage.createGenre(genreData);
      res.status(201).json(newGenre);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Mood Routes
  app.get('/api/moods', async (_req, res) => {
    try {
      const moods = await storage.getMoods();
      res.json(moods);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching moods' });
    }
  });
  
  app.post('/api/moods', requireAdmin, async (req, res) => {
    try {
      const moodData = insertMoodSchema.parse(req.body);
      const newMood = await storage.createMood(moodData);
      res.status(201).json(newMood);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Filter tracks by genre/mood
  app.get('/api/tracks/filter/genre/:genre', async (req, res) => {
    try {
      const genre = req.params.genre;
      const tracks = await storage.getTracksByGenre(genre);
      res.json(tracks);
    } catch (err) {
      res.status(500).json({ message: 'Error filtering tracks by genre' });
    }
  });
  
  app.get('/api/tracks/filter/mood/:mood', async (req, res) => {
    try {
      const mood = req.params.mood;
      const tracks = await storage.getTracksByMood(mood);
      res.json(tracks);
    } catch (err) {
      res.status(500).json({ message: 'Error filtering tracks by mood' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Import express since it's used in the static middleware
import express from "express";
