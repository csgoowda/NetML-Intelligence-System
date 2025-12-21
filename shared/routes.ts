import { z } from 'zod';
import { insertVideoSchema, insertMessageSchema, insertMemoryLogSchema, insertNetworkStatSchema, videos, messages, memoryLogs, networkStats } from './schema';

export const api = {
  videos: {
    list: {
      method: 'GET' as const,
      path: '/api/videos',
      responses: {
        200: z.array(z.custom<typeof videos.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/videos/:id',
      responses: {
        200: z.custom<typeof videos.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/videos',
      input: insertVideoSchema,
      responses: {
        201: z.custom<typeof videos.$inferSelect>(),
      },
    },
  },
  messages: {
    list: {
      method: 'GET' as const,
      path: '/api/videos/:videoId/messages',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/videos/:videoId/messages',
      input: insertMessageSchema.omit({ videoId: true }),
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
      },
    },
  },
  memory: {
    list: {
      method: 'GET' as const,
      path: '/api/videos/:videoId/memory',
      responses: {
        200: z.array(z.custom<typeof memoryLogs.$inferSelect>()),
      },
    },
    create: { // To manually trigger memory updates for demo purposes
      method: 'POST' as const,
      path: '/api/videos/:videoId/memory',
      input: insertMemoryLogSchema.omit({ videoId: true }),
      responses: {
        201: z.custom<typeof memoryLogs.$inferSelect>(),
      },
    },
  },
  network: {
    list: {
      method: 'GET' as const,
      path: '/api/videos/:videoId/network',
      responses: {
        200: z.array(z.custom<typeof networkStats.$inferSelect>()),
      },
    },
    // No create needed, we'll generate simulation data on GET or have a separate sim endpoint
  },
  chat: {
    completions: {
      method: 'POST' as const,
      path: '/api/chat/completions',
      input: z.object({
        message: z.string(),
        history: z.array(z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string()
        })),
        context: z.string().optional() // Video context/description
      }),
      responses: {
        200: z.object({ role: z.literal('assistant'), content: z.string() }),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
