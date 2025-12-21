import { Network, Server, Share2, Wifi, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { NetworkProtocols } from "@/components/NetworkProtocols";

export default function NetworkTopic() {
  const sections = [
    {
      title: "Adaptive Bitrate Streaming (ABR)",
      content: "Modern streaming protocols like HLS and DASH break video into small chunks (segments) encoded at multiple quality levels. The client player dynamically requests segments based on current network bandwidth, ensuring uninterrupted playback even under fluctuating conditions.",
      icon: Wifi,
    },
    {
      title: "Content Delivery Networks (CDN)",
      content: "To minimize latency, video content is cached on edge servers geographically closer to the user. This reduces the Round Trip Time (RTT) and prevents congestion at the origin server during high-traffic events.",
      icon: Share2,
    },
    {
      title: "TCP vs UDP for Streaming",
      content: "While on-demand streaming typically uses TCP (via HTTP) for reliability, live streaming increasingly adopts UDP-based protocols (like WebRTC or SRT) to prioritize low latency over perfect packet delivery, accepting minor artifacting for real-time synchronization.",
      icon: Server,
    },
    {
      title: "Buffer Management",
      content: "The client maintains a playback buffer to absorb network jitter. A key challenge in low-latency streaming is minimizing this buffer size without causing 'rebuffering' events (stalls). Our StreamChat platform visualizes this delicate balance in real-time.",
      icon: Network,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Network Engineering
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The infrastructure powering modern video understanding systems.
          Without robust transport layers, real-time AI analysis is impossible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <section.icon className="w-24 h-24" />
            </div>
            
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <section.icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-bold mb-3">{section.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Network className="w-6 h-6 text-primary" />
          Streaming Protocols Comparison
        </h2>
        <NetworkProtocols />
      </div>

      <div className="bg-card/30 border border-dashed border-border rounded-xl p-8 mt-12">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Real-time Visualization Logic
        </h3>
        <p className="text-muted-foreground font-mono text-sm leading-relaxed">
          The graphs in the Video Workspace demonstrate these concepts live. We calculate throughput (kbps) based on chunk size / download time, and measure latency as the delta between generation time and playback time.
          <br /><br />
          <span className="text-accent">{`// Conceptual Simulation Logic`}</span><br />
          {`const throughput = segmentSize / (downloadEnd - downloadStart);`}<br />
          {`const health = bufferDuration - minSafeBuffer;`}
        </p>
      </div>
    </div>
  );
}
