"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useTheme } from "next-themes";

interface ChartData {
  time: string;
  count: number;
}

const LogTrendChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = isDark ? "#1e293b" : "#f1f3f3"; // slate-800 : gray-100
  const tickColor = isDark ? "#64748b" : "#94a3b8"; // slate-500 : slate-400
  return (
    <div className="h-[300px] w-full mt-8 p-6 bg-white dark:bg-[#111113] border border-border rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Ingestion Frequency</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-medium text-muted-foreground lowercase">logs / sec</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A09C5E" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#A09C5E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: tickColor }}
            interval="preserveStartEnd"
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: tickColor }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', 
              backgroundColor: isDark ? '#111113' : '#fff',
              boxShadow: 'none',
              fontSize: '11px',
              fontFamily: 'inherit'
            }} 
            itemStyle={{ color: 'inherit' }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#A09C5E" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCount)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LogTrendChart;
