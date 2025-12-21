import { useRef, useState, useEffect } from "react";
import { Camera, CameraOff, Maximize2, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalyzeImage } from "@/hooks/use-vision";
import clsx from "clsx";

export function WebcamCapture({ className, onAnalysisDone }: { className?: string; onAnalysisDone?: (response: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const analyzeImage = useAnalyzeImage();

  useEffect(() => {
    if (!isActive) return;

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Webcam access denied:", err);
        setHasPermission(false);
        setIsActive(false);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  const toggleWebcam = () => {
    setIsActive(!isActive);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    const imageBase64 = canvasRef.current.toDataURL("image/jpeg").split(",")[1];
    
    try {
      const response = await analyzeImage.mutateAsync({
        imageBase64,
        question: "What do you see in this image? Describe the scene, objects, and any interesting details.",
        context: "Live webcam analysis from StreamChat platform"
      });
      
      if (onAnalysisDone) {
        onAnalysisDone(response.content);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    }
  };

  return (
    <div className={clsx("relative aspect-video bg-black rounded-xl overflow-hidden border border-border shadow-xl group", className)}>
      {!isActive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 to-background/50 backdrop-blur-sm">
          <Camera className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground mb-4">Webcam Stream</p>
          <Button
            size="sm"
            onClick={toggleWebcam}
            className="gap-2"
            variant="outline"
          >
            <Camera className="w-4 h-4" /> Enable Webcam
          </Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-mono text-cyan-400 border border-cyan-400/30 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
              WEBCAM ACTIVE
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button
              size="sm"
              onClick={captureAndAnalyze}
              disabled={analyzeImage.isPending}
              className="gap-2 flex-1 bg-primary/90 hover:bg-primary"
            >
              {analyzeImage.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Analyze Frame
                </>
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleWebcam}
              className="bg-black/60 hover:bg-black/80 backdrop-blur text-white"
            >
              <CameraOff className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
