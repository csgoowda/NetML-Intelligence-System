import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Activity, Wifi, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface DataPoint {
  time: string;
  bitrate: number;
  latency: number;
  buffer: number;
}

export function NetworkCharts({ isActive = true }: { isActive?: boolean }) {
  const [data, setData] = useState<DataPoint[]>([]);

  // Simulate live data
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });
      
      setData(prev => {
        const newData = [...prev, {
          time: timeStr,
          bitrate: 4500 + Math.random() * 1500, // 4500-6000 kbps
          latency: 20 + Math.random() * 40,     // 20-60 ms
          buffer: 10 + Math.random() * 5,       // 10-15s buffer
        }];
        return newData.slice(-20); // Keep last 20 points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 rounded shadow-xl text-xs font-mono">
          <p className="text-muted-foreground mb-1">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2" style={{ color: p.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}: {Math.round(p.value)} {p.unit}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Bitrate & Buffer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 border border-border rounded-xl p-4 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Stream Throughput</h3>
          </div>
          <span className="text-xs font-mono text-primary animate-pulse">LIVE</span>
        </div>
        <div className="flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBitrate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="bitrate" 
                name="Bitrate" 
                unit="kbps"
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBitrate)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Latency */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 border border-border rounded-xl p-4 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Network Latency</h3>
          </div>
          <span className="text-xs font-mono text-secondary">{data[data.length - 1]?.latency.toFixed(1) || '--'} ms</span>
        </div>
        <div className="flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="latency" 
                name="Latency" 
                unit="ms"
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
