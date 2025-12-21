import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertMessage } from "@shared/schema";
import { z } from "zod";

// GET /api/videos/:videoId/messages
export function useMessages(videoId: number) {
  return useQuery({
    queryKey: [api.messages.list.path, videoId],
    queryFn: async () => {
      const url = buildUrl(api.messages.list.path, { videoId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!videoId,
  });
}

// POST /api/videos/:videoId/messages
export function useCreateMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId, ...data }: InsertMessage) => {
      const url = buildUrl(api.messages.create.path, { videoId });
      const res = await fetch(url, {
        method: api.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.messages.list.path, variables.videoId] 
      });
    },
  });
}

// POST /api/chat/completions
export function useChatCompletion() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.chat.completions.input>) => {
      const res = await fetch(api.chat.completions.path, {
        method: api.chat.completions.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to get completion");
      return api.chat.completions.responses[200].parse(await res.json());
    },
  });
}
