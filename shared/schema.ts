import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  genre: text("genre").notNull(),
  mood: text("mood").notNull(),
  duration: text("duration").notNull(),
  bpm: integer("bpm"),
  key: text("key"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  imageUrl: text("image_url"),
});

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
  createdAt: true,
});

export const insertGenreSchema = createInsertSchema(genres).omit({
  id: true,
});

export const insertMoodSchema = createInsertSchema(moods).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Track = typeof tracks.$inferSelect;
export type Genre = typeof genres.$inferSelect;
export type Mood = typeof moods.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type InsertGenre = z.infer<typeof insertGenreSchema>;
export type InsertMood = z.infer<typeof insertMoodSchema>;
