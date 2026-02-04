"use client";

import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

interface Log {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  source?: string;
}

interface LogFeedProps {
  logs: Log[];
  title?: string;
  isSearching?: boolean;
}

const LogFeed: React.FC<LogFeedProps> = ({ logs, title = "Live Stream", isSearching = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = React.useState<"ALL" | "INFO" | "WARN" | "ERROR">("ALL");

  const filteredLogs = filter === "ALL" 
    ? logs 
    : logs.filter(l => l.level === filter);

  // Auto-scroll to top when new logs arrive if we are at the top
  useEffect(() => {
    if (scrollRef.current) {
      // Logic for auto-scroll if needed, but usually new logs at top is better for monitoring
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-[600px] border border-border rounded-2xl bg-white dark:bg-[#111113] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-background/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-[#F1F3F3] dark:bg-slate-800 rounded-lg">
            {["ALL", "INFO", "WARN", "ERROR"].map((lv) => (
              <button
                key={lv}
                onClick={() => setFilter(lv as any)}
                className={cn(
                  "px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all cursor-pointer",
                  filter === lv 
                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {lv}
              </button>
            ))}
          </div>
          <h2 className="text-sm font-semibold text-[#4A4A2C] uppercase tracking-wider flex items-center gap-2">
            {!isSearching && title === "Live Stream" && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            {isSearching ? "Searching..." : title}
          </h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.open('/api/logs/export?format=csv', '_blank')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            title="Export CSV"
          >
            <Download size={14} />
            CSV
          </button>
          <button 
            onClick={() => window.open('/api/logs/export?format=json', '_blank')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            title="Export JSON"
          >
            <Download size={14} />
            JSON
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredLogs.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm italic">
                {isSearching ? "Querying database..." : "No logs found matching your query."}
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <motion.div
                  key={`${log.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "group flex items-start gap-4 p-3 rounded-xl border border-transparent transition-all duration-300",
                    log.level === "ERROR" && "hover:bg-rose-50/50 dark:hover:bg-rose-900/10 hover:border-rose-100 dark:hover:border-rose-900/30 hover:shadow-[0_0_15px_-5px_rgba(244,63,94,0.1)]",
                    log.level === "WARN" && "hover:bg-amber-50/50 dark:hover:bg-amber-900/10 hover:border-amber-100 dark:hover:border-amber-900/30 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]",
                    log.level === "INFO" && "hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:border-blue-100 dark:hover:border-blue-900/30 hover:shadow-[0_0_15px_-5px_rgba(59,130,246,0.1)]"
                  )}
                >
                  <div className="pt-1">
                    <SeverityBadge level={log.level} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest leading-none">
                        {new Date(log.timestamp).toLocaleTimeString()} · {log.source || 'system'}
                      </span>
                    </div>
                    <p className="text-sm text-[#616164] dark:text-[#A1A1A5] font-medium leading-relaxed tracking-tight">
                      {log.message}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SeverityBadge = ({ level }: { level: Log["level"] }) => {
  const styles = {
    INFO: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    WARN: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    ERROR: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
  };

  return (
    <Badge variant="outline" className={cn("text-[8px] px-1.5 py-0 font-bold uppercase tracking-widest border shadow-none", styles[level])}>
      {level}
    </Badge>
  );
};

export default LogFeed;
