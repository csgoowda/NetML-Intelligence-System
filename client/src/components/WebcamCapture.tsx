import { useRef, useState, useEffect } from "react";
import { Camera, CameraOff, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export function WebcamCapture({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

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
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-mono text-cyan-400 border border-cyan-400/30 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
              WEBCAM ACTIVE
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleWebcam}
            className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur text-white"
          >
            <CameraOff className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
}
