import { db } from "./db";
import {
  videos, messages, memoryLogs, networkStats,
  type Video, type InsertVideo,
  type Message, type InsertMessage,
  type MemoryLog, type InsertMemoryLog,
  type NetworkStat, type InsertNetworkStat
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Videos
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;

  // Messages
  getMessages(videoId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Memory Logs
  getMemoryLogs(videoId: number): Promise<MemoryLog[]>;
  createMemoryLog(log: InsertMemoryLog): Promise<MemoryLog>;

  // Network Stats
  getNetworkStats(videoId: number): Promise<NetworkStat[]>;
  createNetworkStat(stat: InsertNetworkStat): Promise<NetworkStat>;
}

export class DatabaseStorage implements IStorage {
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos);
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async getMessages(videoId: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.videoId, videoId))
      .orderBy(messages.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMemoryLogs(videoId: number): Promise<MemoryLog[]> {
    return await db.select()
      .from(memoryLogs)
      .where(eq(memoryLogs.videoId, videoId))
      .orderBy(desc(memoryLogs.timestamp))
      .limit(50);
  }

  async createMemoryLog(log: InsertMemoryLog): Promise<MemoryLog> {
    const [newLog] = await db.insert(memoryLogs).values(log).returning();
    return newLog;
  }

  async getNetworkStats(videoId: number): Promise<NetworkStat[]> {
    return await db.select()
      .from(networkStats)
      .where(eq(networkStats.videoId, videoId))
      .orderBy(desc(networkStats.timestamp))
      .limit(100);
  }

  async createNetworkStat(stat: InsertNetworkStat): Promise<NetworkStat> {
    const [newStat] = await db.insert(networkStats).values(stat).returning();
    return newStat;
  }
}

class MockStorage implements IStorage {
  private videos: Video[] = [];
  private messages: Message[] = [];
  private memoryLogs: MemoryLog[] = [];
  private networkStats: NetworkStat[] = [];
  private nextId = 1;

  async getVideos(): Promise<Video[]> {
    return this.videos;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.find(v => v.id === id);
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const newVideo: Video = { ...video, id: this.nextId++, createdAt: new Date() };
    this.videos.push(newVideo);
    return newVideo;
  }

  async getMessages(videoId: number): Promise<Message[]> {
    return this.messages.filter(m => m.videoId === videoId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = { ...message, id: this.nextId++, timestamp: new Date() };
    this.messages.push(newMessage);
    return newMessage;
  }

  async getMemoryLogs(videoId: number): Promise<MemoryLog[]> {
    return this.memoryLogs.filter(m => m.videoId === videoId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
  }

  async createMemoryLog(log: InsertMemoryLog): Promise<MemoryLog> {
    const newLog: MemoryLog = { ...log, id: this.nextId++, timestamp: new Date() };
    this.memoryLogs.push(newLog);
    return newLog;
  }

  async getNetworkStats(videoId: number): Promise<NetworkStat[]> {
    return this.networkStats.filter(n => n.videoId === videoId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 100);
  }

  async createNetworkStat(stat: InsertNetworkStat): Promise<NetworkStat> {
    const newStat: NetworkStat = { ...stat, id: this.nextId++, timestamp: new Date() };
    this.networkStats.push(newStat);
    return newStat;
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MockStorage();
