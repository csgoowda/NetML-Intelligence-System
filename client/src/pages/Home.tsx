import { useVideos, useCreateVideo } from "@/hooks/use-videos";
import { Link } from "wouter";
import { Loader2, Play, Plus, Video as VideoIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: videos, isLoading } = useVideos();
  const createVideo = useCreateVideo();

  const handleCreateDefault = () => {
    createVideo.mutate({
      title: "Big Buck Bunny Demo",
      description: "A large rabbit meets three bullying rodents.",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=640", // Camera lens
      duration: 596, // seconds
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Stream Library</h1>
          <p className="text-muted-foreground max-w-xl">
            Select a video stream to analyze with the neural chat system. 
            The system will perform real-time memory formation and network analysis.
          </p>
        </div>
        
        <button 
          onClick={handleCreateDefault}
          disabled={createVideo.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
        >
          {createVideo.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Demo Stream
        </button>
      </div>

      {(!videos || videos.length === 0) ? (
        <div className="bg-card/30 border border-dashed border-border rounded-xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <VideoIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No Streams Available</h3>
          <p className="text-muted-foreground">Click the button above to load the demo dataset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/video/${video.id}`}>
                <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer h-full flex flex-col">
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img 
                      src={video.thumbnailUrl || ""} 
                      alt={video.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 ml-1" />
                      </div>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-xs font-mono text-white border border-white/10">
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{video.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{video.description}</p>
                    
                    <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-mono text-muted-foreground/70 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
                      Ready for analysis
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
