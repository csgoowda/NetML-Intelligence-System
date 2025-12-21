import { useParams } from "wouter";
import { useVideo } from "@/hooks/use-videos";
import { useMessages, useCreateMessage, useChatCompletion } from "@/hooks/use-chat";
import { useMemoryLogs } from "@/hooks/use-memory";
import { Loader2, ChevronLeft, Cpu, Activity, Server, Play, Pause, Monitor } from "lucide-react";
import { Link } from "wouter";
import { ChatInterface } from "@/components/ChatInterface";
import { MemoryStream } from "@/components/MemoryStream";
import { NetworkCharts } from "@/components/NetworkCharts";
import { WebcamCapture } from "@/components/WebcamCapture";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

export default function VideoWorkspace() {
  const { id } = useParams();
  const videoId = parseInt(id || "0");
  const { data: video, isLoading: loadingVideo } = useVideo(videoId);
  const { data: messages = [] } = useMessages(videoId);
  const { data: memoryLogs = [] } = useMemoryLogs(videoId);
  
  const createMessage = useCreateMessage();
  const chatCompletion = useChatCompletion();

  const [isPlaying, setIsPlaying] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // When sending a message, we:
  // 1. Optimistically/Server-side save user message
  // 2. Call OpenAI completion
  // 3. Save Assistant message
  const handleSendMessage = async (content: string) => {
    try {
      // 1. Create User Message
      await createMessage.mutateAsync({
        videoId,
        role: "user",
        content,
      });

      // 2. Get AI Response
      // We pass partial history (last 5 messages) for context
      const history = messages.slice(-5).map(m => ({ 
        role: m.role as 'user' | 'assistant', 
        content: m.content 
      }));

      const completion = await chatCompletion.mutateAsync({
        message: content,
        history,
        context: `Current video context: ${video?.title}. ${video?.description}`
      });

      // 3. Create Assistant Message
      await createMessage.mutateAsync({
        videoId,
        role: "assistant",
        content: completion.content
      });

    } catch (err) {
      console.error("Chat failed", err);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  if (loadingVideo || !video) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const SystemStatus = ({ label, status, icon: Icon }: any) => (
    <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
      <div className={clsx(
        "p-2 rounded-md",
        status === 'active' ? "bg-primary/20 text-primary animate-pulse" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</div>
        <div className="text-xs font-mono flex items-center gap-1.5 mt-0.5">
          <span className={clsx("w-1.5 h-1.5 rounded-full", status === 'active' ? "bg-primary" : "bg-muted-foreground/30")} />
          {status === 'active' ? 'PROCESSING' : 'IDLE'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Back Link */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <a className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </a>
        </Link>
        <span className="text-border mx-2">|</span>
        <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground/80">{video.title} Workspace</h2>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Video & System Stats (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
          
          {/* Source Toggle */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={!useWebcam ? "default" : "outline"}
              onClick={() => setUseWebcam(false)}
              className="gap-2 flex-1"
            >
              <Play className="w-4 h-4" /> File Stream
            </Button>
            <Button
              size="sm"
              variant={useWebcam ? "default" : "outline"}
              onClick={() => setUseWebcam(true)}
              className="gap-2 flex-1"
            >
              <Monitor className="w-4 h-4" /> Webcam
            </Button>
          </div>

          {/* Video Player Section */}
          <div className={clsx("relative aspect-video bg-black rounded-xl overflow-hidden border border-border shadow-2xl group", useWebcam && "hidden")}>
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls={false} // Custom controls below
            />
            {/* Custom Overlay Controls */}
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform">
                {isPlaying ? <Pause className="w-8 h-8 text-white fill-current" /> : <Play className="w-8 h-8 text-white fill-current ml-1" />}
              </div>
            </div>
            
            {/* Status Overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-mono text-green-400 border border-green-400/30 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                LIVE STREAM
              </div>
              <div className="px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-mono text-white/80 border border-white/10">
                H.264 / 1080p
              </div>
            </div>
          </div>

          {/* Webcam Section */}
          {useWebcam && <WebcamCapture />}

          {/* Bottom Panel: Analytics & Memory (Scrollable if needed, or flex fits) */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Network Analytics */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                <Activity className="w-4 h-4" /> Network Telemetry
              </h3>
              <div className="flex-1 min-h-[250px] bg-card/30 rounded-xl border border-border p-1">
                <NetworkCharts isActive={isPlaying} />
              </div>
            </div>

            {/* Memory & System Status */}
            <div className="flex flex-col gap-4">
              {/* Status Indicators */}
              <div className="grid grid-cols-3 gap-2">
                <SystemStatus label="Ingest" status={isPlaying ? 'active' : 'idle'} icon={Server} />
                <SystemStatus label="Neural Net" status={createMessage.isPending || isPlaying ? 'active' : 'idle'} icon={Cpu} />
                <SystemStatus label="Memory" status={chatCompletion.isPending ? 'active' : 'idle'} icon={Activity} />
              </div>
              
              {/* Memory Log Stream */}
              <div className="flex-1 min-h-[200px]">
                <MemoryStream logs={memoryLogs} isProcessing={isPlaying} />
              </div>
            </div>

          </div>
        </div>

        {/* Right Col: Chat Interface (4 cols) */}
        <div className="lg:col-span-4 min-h-0 h-full">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isSending={createMessage.isPending || chatCompletion.isPending}
          />
        </div>

      </div>
    </div>
  );
}
