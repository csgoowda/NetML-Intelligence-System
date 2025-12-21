import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAnalyzeImage() {
  return useMutation({
    mutationFn: async (data: {
      imageBase64: string;
      question: string;
      context?: string;
    }) => {
      const response = await fetch(api.chat.analyzeImage.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to analyze image");
      return response.json();
    },
  });
}
