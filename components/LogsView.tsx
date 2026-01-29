"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface Log {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  source?: string;
}

interface LogsViewProps {
  logs: Log[];
}

const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
  const [levelFilter, setLevelFilter] = React.useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = React.useState<string>("");

  // Get unique sources for the filter dropdown
  const uniqueSources = Array.from(new Set(logs.map(l => l.source || "system")));

  // Compute analytics
  const filteredLogs = logs.filter(l => {
    const matchesLevel = levelFilter === "ALL" || l.level === levelFilter;
    const matchesSource = !sourceFilter || (l.source || "system").toLowerCase().includes(sourceFilter.toLowerCase());
    return matchesLevel && matchesSource;
  });

  const severityData = [
    { name: "INFO", value: logs.filter(l => l.level === "INFO").length, color: "#64b5f6" },
    { name: "WARN", value: logs.filter(l => l.level === "WARN").length, color: "#ffb74d" },
    { name: "ERROR", value: logs.filter(l => l.level === "ERROR").length, color: "#e57373" },
  ];

  const sourceCounts: Record<string, number> = {};
  logs.forEach(l => {
    const src = l.source || "system";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  const sourceData = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tight">Logs Analytics & History</h2>
        <p className="text-sm text-muted-foreground">Detailed breakdown of system events and historical data.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Severity Distribution */}
        <Card className="p-6 bg-white dark:bg-[#111113] border-border shadow-none">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Severity Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #B4B4B4', 
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {severityData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] font-bold text-muted-foreground">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Source Analytics */}
        <Card className="p-6 bg-white dark:bg-[#111113] border-border shadow-none">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Top Sources</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid horizontal={false} strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#B4B4B4" }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #B4B4B4', 
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    fontSize: '11px'
                  }} 
                />
                <Bar dataKey="value" fill="#A09C5E" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* History Table Overlay Style */}
      <Card className="border-border shadow-none bg-white dark:bg-[#111113] overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full History ({filteredLogs.length})</h3>
            <div className="flex p-1 bg-[#F1F3F3] dark:bg-slate-800 rounded-lg">
              {["ALL", "INFO", "WARN", "ERROR"].map((lv) => (
                <button
                  key={lv}
                  onClick={() => setLevelFilter(lv)}
                  className={cn(
                    "px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded-md transition-all cursor-pointer",
                    levelFilter === lv 
                      ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Filter by source..." 
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-[#F1F3F3] dark:bg-slate-800 border-none rounded-lg py-1.5 pl-8 pr-3 text-[10px] w-48 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">Updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 border-b border-border z-10">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Timestamp</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Level</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Source</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group cursor-default">
                    <td className="px-6 py-4 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        "text-[8px] font-bold uppercase py-0 px-1.5 border shadow-none",
                        log.level === "ERROR" ? "bg-rose-50 text-rose-600 border-rose-100" :
                        log.level === "WARN" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {log.level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-[#4A4A2C] dark:text-[#E2E2D1] uppercase tracking-wider">
                      {log.source || 'system'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#616164] dark:text-[#A1A1A5] font-medium max-w-md truncate">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default LogsView;
