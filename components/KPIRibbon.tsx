"use client";

import React from "react";
import { 
  Database, 
  AlertCircle, 
  Server, 
  Zap 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
}

const KPICard: React.FC<KPICardProps> = ({ label, value, icon, trend, trendType = "neutral" }) => (
  <Card className="p-5 border-border shadow-none bg-white dark:bg-[#111113] hover:border-primary/30 dark:hover:border-primary/50 transition-colors group cursor-pointer">
    <div className="flex items-start justify-between">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tighter">{value}</h3>
        {/* The button was placed here based on the instruction's context, assuming it's a separate element within the same div */}
        {/* Note: The original instruction snippet for the button was incomplete and syntactically incorrect.
            This is an interpretation to make it a valid React component.
            If the button is only for specific cards, conditional rendering might be needed. */}
        {label === "Total Ingestion" && ( // Example: only show for "Total Ingestion" card
          <button
            onClick={() => window.open('/api/logs/export?format=csv', '_blank')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            title="Export CSV"
          >
            Export CSV
          </button>
        )}
      </div>
      <div className="p-2.5 bg-background dark:bg-slate-800 rounded-lg text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-2">
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase",
          trendType === "positive" && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          trendType === "negative" && "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
          trendType === "neutral" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
        )}>
          {trend}
        </span>
        <span className="text-[10px] text-muted-foreground">vs. last hour</span>
      </div>
    )}
  </Card>
);

const KPIRibbon: React.FC<{ logsCount: number; errorRate: string; connectedNodes: number }> = ({ logsCount, errorRate, connectedNodes }) => {
  const healthStatus = connectedNodes > 0 ? "Healthy" : "Idle";
  const healthTrend = connectedNodes > 0 ? `${connectedNodes} Nodes` : "Offline";
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KPICard 
        label="Total Ingestion" 
        value={logsCount.toLocaleString()} 
        icon={<Database size={20} />} 
        trend={logsCount > 0 ? "+100%" : "0%"} 
        trendType={logsCount > 0 ? "positive" : "neutral"}
      />
      <KPICard 
        label="Avg. Latency" 
        value={logsCount > 0 ? "12ms" : "0ms"} 
        icon={<Zap size={20} />} 
        trend={logsCount > 0 ? "-2ms" : "N/A"} 
        trendType="positive"
      />
      <KPICard 
        label="Critical Errors" 
        value={errorRate} 
        icon={<AlertCircle size={20} />} 
        trend={parseInt(errorRate) > 0 ? "Active" : "None"} 
        trendType={parseInt(errorRate) > 10 ? "negative" : "neutral"}
      />
      <KPICard 
        label="Fleet Status" 
        value={healthStatus} 
        icon={<Server size={20} />} 
        trend={healthTrend}
        trendType={connectedNodes > 0 ? "positive" : "neutral"}
      />
    </div>
  );
};

export default KPIRibbon;
