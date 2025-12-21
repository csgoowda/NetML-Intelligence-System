import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration").notNull(), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// For simulating the "Memory" updates described in the paper
export const memoryLogs = pgTable("memory_logs", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull(),
  type: text("type").notNull(), // 'short_term', 'long_term', 'dialogue'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// For the "Computer Network" topic visualization
export const networkStats = pgTable("network_stats", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull(),
  bitrate: integer("bitrate").notNull(), // kbps
  latency: integer("latency").notNull(), // ms
  bufferHealth: integer("buffer_health").notNull(), // seconds
  timestamp: timestamp("timestamp").defaultNow(),
});

// === SCHEMAS ===

export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });
export const insertMemoryLogSchema = createInsertSchema(memoryLogs).omit({ id: true, timestamp: true });
export const insertNetworkStatSchema = createInsertSchema(networkStats).omit({ id: true, timestamp: true });

// === TYPES ===

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type MemoryLog = typeof memoryLogs.$inferSelect;
export type InsertMemoryLog = z.infer<typeof insertMemoryLogSchema>;

export type NetworkStat = typeof networkStats.$inferSelect;
export type InsertNetworkStat = z.infer<typeof insertNetworkStatSchema>;
