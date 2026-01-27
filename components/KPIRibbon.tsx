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
  <Card className="p-5 border-border shadow-none bg-white hover:border-primary/30 transition-colors group">
    <div className="flex items-start justify-between">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-[#4A4A2C] tracking-tighter">{value}</h3>
      </div>
      <div className="p-2.5 bg-background rounded-lg text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-2">
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase",
          trendType === "positive" && "bg-emerald-50 text-emerald-600",
          trendType === "negative" && "bg-rose-50 text-rose-600",
          trendType === "neutral" && "bg-blue-50 text-blue-600"
        )}>
          {trend}
        </span>
        <span className="text-[10px] text-muted-foreground">vs. last hour</span>
      </div>
    )}
  </Card>
);

const KPIRibbon: React.FC<{ logsCount: number; errorRate: string }> = ({ logsCount, errorRate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <KPICard 
        label="Total Ingestion" 
        value={logsCount.toLocaleString()} 
        icon={<Database size={20} />} 
        trend="+12%" 
        trendType="positive"
      />
      <KPICard 
        label="Avg. Latency" 
        value="12ms" 
        icon={<Zap size={20} />} 
        trend="-4ms" 
        trendType="positive"
      />
      <KPICard 
        label="Critical Errors" 
        value={errorRate} 
        icon={<AlertCircle size={20} />} 
        trend="+2" 
        trendType="negative"
      />
      <KPICard 
        label="Cluster Health" 
        value="Stable" 
        icon={<Server size={20} />} 
        trend="99.9%"
        trendType="neutral"
      />
    </div>
  );
};

export default KPIRibbon;
