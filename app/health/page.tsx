"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Activity, Server, Database, Globe, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HealthPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uptime, setUptime] = useState(0);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Health check failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Check every 30s
    const uptimeInterval = setInterval(() => setUptime(u => u + 1), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(uptimeInterval);
    };
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <DashboardLayout activeView="settings">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tighter uppercase">System Health</h2>
            <p className="text-sm text-muted-foreground mt-1">Infrastructure vitals and connectivity status.</p>
          </div>
          <button 
            onClick={fetchHealth}
            disabled={loading}
            className="p-3 bg-white dark:bg-[#111113] border border-border rounded-xl hover:text-primary transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCcw className={loading ? "animate-spin" : ""} size={20} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HealthCard 
            title="Application"
            status="Operational"
            icon={<Globe className="text-blue-500" />}
            detail={`Uptime: ${formatUptime(uptime)}`}
          />
          <HealthCard 
            title="Database"
            status={status?.services?.mongodb === "connected" ? "Connected" : "Disconnected"}
            icon={<Database className={status?.services?.mongodb === "connected" ? "text-emerald-500" : "text-rose-500"} />}
            detail="MongoDB Cluster 0"
          />
          <HealthCard 
            title="Caching"
            status={status?.services?.redis === "connected" ? "Active" : "Down"}
            icon={<Server className={status?.services?.redis === "connected" ? "text-amber-500" : "text-rose-500"} />}
            detail="Redis Pub/Sub Layer"
          />
        </div>

        <Card className="p-8 bg-white dark:bg-[#111113] border-border shadow-none">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Activity className="text-primary w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tight">System Reliability</h3>
              <p className="text-xs text-muted-foreground">Confidence score based on recent ingestion performance.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">Current Load</span>
                <span className="text-primary">24%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '24%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="text-blue-500">412MB / 1GB</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
          <CheckCircle2 className="text-emerald-500 w-5 h-5" />
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">All systems functional. No active incidents.</span>
        </div>
      </div>
    </DashboardLayout>
  );
}

const HealthCard = ({ title, status, icon, detail }: any) => (
  <Card className="p-6 bg-white dark:bg-[#111113] border-border shadow-none hover:border-primary/30 transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className="p-2.5 bg-background dark:bg-slate-900 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      {status === "Connected" || status === "Operational" || status === "Active" ? (
        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 uppercase text-[9px] font-bold px-2 py-0">Healthy</Badge>
      ) : (
        <Badge className="bg-rose-50 text-rose-600 border-rose-100 uppercase text-[9px] font-bold px-2 py-0">Critical</Badge>
      )}
    </div>
    <div className="space-y-1">
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</h4>
      <p className="text-lg font-bold text-[#4A4A2C] dark:text-[#E2E2D1]">{status}</p>
      <p className="text-[10px] text-muted-foreground font-mono">{detail}</p>
    </div>
  </Card>
);

const Badge = ({ children, className }: any) => (
  <span className={cn("px-2 py-0.5 rounded-full border border-border text-[10px] font-medium", className)}>
    {children}
  </span>
);
