import { motion } from "framer-motion";
import { Activity, Zap, Wifi, Clock } from "lucide-react";

const protocols = [
  {
    name: "HLS (HTTP Live Streaming)",
    description: "Breaks video into small chunks (segments) of 2-10 seconds. Client requests segments sequentially. Provides excellent compatibility across all browsers and devices.",
    latency: "10-30s",
    reliability: "Very High",
    icon: Wifi,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "DASH (Dynamic Adaptive Streaming)",
    description: "Similar to HLS but with more granular control. Uses MPD manifest for segment info. Enables better adaptive bitrate selection and lower latency variants.",
    latency: "5-15s",
    reliability: "High",
    icon: Activity,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "WebRTC (Real-time Communication)",
    description: "Ultra-low latency protocol using UDP and peer-to-peer connections. Ideal for interactive streaming but requires maintained connections. Sub-second latency possible.",
    latency: "<1s",
    reliability: "Medium (network dependent)",
    icon: Zap,
    color: "from-orange-500 to-red-500",
  },
  {
    name: "RTMP (Real Time Messaging Protocol)",
    description: "Legacy but still widely used for ingest. Streams continuously to server. Modern players prefer HLS/DASH for playback due to firewall issues.",
    latency: "1-3s",
    reliability: "High (for ingest)",
    icon: Clock,
    color: "from-green-500 to-emerald-500",
  },
];

export function NetworkProtocols() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {protocols.map((protocol, idx) => {
          const Icon = protocol.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-card/40 border border-border rounded-lg hover:border-primary/50 transition-colors overflow-hidden relative group"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-r ${protocol.color}`} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-md bg-gradient-to-br ${protocol.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{protocol.name}</h4>
                    <div className="flex gap-3 mt-1 text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
                      <span>Latency: <span className="text-primary font-bold">{protocol.latency}</span></span>
                      <span>Reliability: <span className="text-accent font-bold">{protocol.reliability}</span></span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{protocol.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
