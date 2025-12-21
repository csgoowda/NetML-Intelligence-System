import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// GET /api/videos/:videoId/network
export function useNetworkStats(videoId: number) {
  return useQuery({
    queryKey: [api.network.list.path, videoId],
    queryFn: async () => {
      const url = buildUrl(api.network.list.path, { videoId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch network stats");
      return api.network.list.responses[200].parse(await res.json());
    },
    enabled: !!videoId,
    // Refetch often for "live" feel if relying on backend, 
    // though we might mostly simulate client-side for this demo.
    refetchInterval: 5000, 
  });
}
