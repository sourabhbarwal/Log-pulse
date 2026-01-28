"use client";

import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

  // Auto-scroll to top when new logs arrive if we are at the top
  useEffect(() => {
    if (scrollRef.current) {
      // Logic for auto-scroll if needed, but usually new logs at top is better for monitoring
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-[500px] border border-border rounded-2xl bg-white overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#4A4A2C] uppercase tracking-wider flex items-center gap-2">
          {!isSearching && title === "Live Stream" && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          {isSearching ? "Searching..." : title}
        </h2>
        <div className="flex gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {logs.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm italic">
                {isSearching ? "Querying database..." : "No logs found matching your query."}
              </div>
            ) : (
              logs.map((log, index) => (
                <motion.div
                  key={`${log.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "group flex items-start gap-4 p-3 rounded-xl border border-transparent transition-all duration-300",
                    log.level === "ERROR" && "hover:bg-rose-50/50 hover:border-rose-100 hover:shadow-[0_0_15px_-5px_rgba(244,63,94,0.1)]",
                    log.level === "WARN" && "hover:bg-amber-50/50 hover:border-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]",
                    log.level === "INFO" && "hover:bg-blue-50/50 hover:border-blue-100 hover:shadow-[0_0_15px_-5px_rgba(59,130,246,0.1)]"
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
                    <p className="text-sm text-[#616164] font-medium leading-relaxed tracking-tight">
                      {log.message}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};

const SeverityBadge = ({ level }: { level: Log["level"] }) => {
  const styles = {
    INFO: "bg-blue-50 text-blue-600 border-blue-100",
    WARN: "bg-amber-50 text-amber-600 border-amber-100",
    ERROR: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <Badge variant="outline" className={cn("text-[8px] px-1.5 py-0 font-bold uppercase tracking-widest border shadow-none", styles[level])}>
      {level}
    </Badge>
  );
};

export default LogFeed;
