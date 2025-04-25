import { 
  type User, type InsertUser, 
  type Track, type InsertTrack,
  type Genre, type InsertGenre,
  type Mood, type InsertMood
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Track operations
  getTracks(): Promise<Track[]>;
  getTrack(id: number): Promise<Track | undefined>;
  getFeaturedTracks(): Promise<Track[]>;
  getTracksByGenre(genre: string): Promise<Track[]>;
  getTracksByMood(mood: string): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  updateTrack(id: number, track: Partial<InsertTrack>): Promise<Track | undefined>;
  deleteTrack(id: number): Promise<boolean>;
  
  // Genre operations
  getGenres(): Promise<Genre[]>;
  getGenre(id: number): Promise<Genre | undefined>;
  createGenre(genre: InsertGenre): Promise<Genre>;
  
  // Mood operations
  getMoods(): Promise<Mood[]>;
  getMood(id: number): Promise<Mood | undefined>;
  createMood(mood: InsertMood): Promise<Mood>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tracks: Map<number, Track>;
  private genres: Map<number, Genre>;
  private moods: Map<number, Mood>;
  private currentUserId: number;
  private currentTrackId: number;
  private currentGenreId: number;
  private currentMoodId: number;

  constructor() {
    this.users = new Map();
    this.tracks = new Map();
    this.genres = new Map();
    this.moods = new Map();
    this.currentUserId = 1;
    this.currentTrackId = 1;
    this.currentGenreId = 1;
    this.currentMoodId = 1;
    
    // Initialize with default genres and moods
    this.initializeData();
  }

  private initializeData() {
    // Initialize default genres
    const defaultGenres = [
      { name: "Cinematic", imageUrl: "" },
      { name: "Electronic", imageUrl: "" },
      { name: "Ambient", imageUrl: "" },
      { name: "Corporate", imageUrl: "" },
      { name: "Orchestral", imageUrl: "" },
    ];
    
    // Initialize default moods
    const defaultMoods = [
      { name: "Uplifting" },
      { name: "Dramatic" },
      { name: "Peaceful" },
      { name: "Energetic" },
      { name: "Melancholic" },
      { name: "Motivational" },
      { name: "Suspenseful" },
      { name: "Inspirational" },
    ];
    
    // Add default genres and moods
    defaultGenres.forEach(genre => this.createGenre(genre));
    defaultMoods.forEach(mood => this.createMood(mood));
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
    });
    
    // Update admin permissions
    const adminUser = this.users.get(1);
    if (adminUser) {
      this.users.set(1, {
        ...adminUser,
        isAdmin: true
      });
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // Track methods
  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getFeaturedTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(track => track.featured);
  }

  async getTracksByGenre(genre: string): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(track => track.genre === genre);
  }

  async getTracksByMood(mood: string): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(track => track.mood === mood);
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.currentTrackId++;
    const track: Track = { 
      ...insertTrack, 
      id, 
      bpm: insertTrack.bpm ?? null,
      key: insertTrack.key ?? null,
      featured: insertTrack.featured ?? false,
      createdAt: new Date() 
    };
    this.tracks.set(id, track);
    return track;
  }

  async updateTrack(id: number, trackUpdate: Partial<InsertTrack>): Promise<Track | undefined> {
    const currentTrack = this.tracks.get(id);
    if (!currentTrack) return undefined;
    
    const updatedTrack: Track = {
      ...currentTrack,
      ...trackUpdate
    };
    
    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }

  async deleteTrack(id: number): Promise<boolean> {
    return this.tracks.delete(id);
  }

  // Genre methods
  async getGenres(): Promise<Genre[]> {
    return Array.from(this.genres.values());
  }

  async getGenre(id: number): Promise<Genre | undefined> {
    return this.genres.get(id);
  }

  async createGenre(insertGenre: InsertGenre): Promise<Genre> {
    const id = this.currentGenreId++;
    const genre: Genre = { 
      ...insertGenre, 
      id,
      imageUrl: insertGenre.imageUrl ?? null
    };
    this.genres.set(id, genre);
    return genre;
  }

  // Mood methods
  async getMoods(): Promise<Mood[]> {
    return Array.from(this.moods.values());
  }

  async getMood(id: number): Promise<Mood | undefined> {
    return this.moods.get(id);
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    const id = this.currentMoodId++;
    const mood: Mood = { ...insertMood, id };
    this.moods.set(id, mood);
    return mood;
  }
}

// Import the database modules
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { 
  users, tracks, genres, moods
} from "@shared/schema"; // Import the schema tables

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Define the session store type
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getTracks(): Promise<Track[]> {
    return await db.select().from(tracks);
  }

  async getTrack(id: number): Promise<Track | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, id));
    return track || undefined;
  }

  async getFeaturedTracks(): Promise<Track[]> {
    return await db.select().from(tracks).where(eq(tracks.featured, true));
  }

  async getTracksByGenre(genre: string): Promise<Track[]> {
    return await db.select().from(tracks).where(eq(tracks.genre, genre));
  }

  async getTracksByMood(mood: string): Promise<Track[]> {
    return await db.select().from(tracks).where(eq(tracks.mood, mood));
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const [track] = await db
      .insert(tracks)
      .values(insertTrack)
      .returning();
    return track;
  }

  async updateTrack(id: number, trackUpdate: Partial<InsertTrack>): Promise<Track | undefined> {
    const [track] = await db
      .update(tracks)
      .set(trackUpdate)
      .where(eq(tracks.id, id))
      .returning();
    return track || undefined;
  }

  async deleteTrack(id: number): Promise<boolean> {
    const result = await db
      .delete(tracks)
      .where(eq(tracks.id, id))
      .returning({ id: tracks.id });
    return result.length > 0;
  }

  async getGenres(): Promise<Genre[]> {
    return await db.select().from(genres);
  }

  async getGenre(id: number): Promise<Genre | undefined> {
    const [genre] = await db.select().from(genres).where(eq(genres.id, id));
    return genre || undefined;
  }

  async createGenre(insertGenre: InsertGenre): Promise<Genre> {
    const [genre] = await db
      .insert(genres)
      .values(insertGenre)
      .returning();
    return genre;
  }

  async getMoods(): Promise<Mood[]> {
    return await db.select().from(moods);
  }

  async getMood(id: number): Promise<Mood | undefined> {
    const [mood] = await db.select().from(moods).where(eq(moods.id, id));
    return mood || undefined;
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    const [mood] = await db
      .insert(moods)
      .values(insertMood)
      .returning();
    return mood;
  }
}

// Use MemStorage for simplicity
export const storage = new MemStorage();
