import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertMemoryLog } from "@shared/schema";

// GET /api/videos/:videoId/memory
export function useMemoryLogs(videoId: number) {
  return useQuery({
    queryKey: [api.memory.list.path, videoId],
    queryFn: async () => {
      const url = buildUrl(api.memory.list.path, { videoId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch memory logs");
      return api.memory.list.responses[200].parse(await res.json());
    },
    enabled: !!videoId,
  });
}

// POST /api/videos/:videoId/memory
export function useCreateMemoryLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId, ...data }: InsertMemoryLog) => {
      const url = buildUrl(api.memory.create.path, { videoId });
      const res = await fetch(url, {
        method: api.memory.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create memory log");
      return api.memory.create.responses[201].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.memory.list.path, variables.videoId] 
      });
    },
  });
}
