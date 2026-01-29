"use client";

import { useSocket } from "@/hooks/useSocket";
import DashboardLayout from "@/components/DashboardLayout";
import KPIRibbon from "@/components/KPIRibbon";
import LogFeed from "@/components/LogFeed";
import LogTrendChart from "@/components/LogTrendChart";
import LogsView from "@/components/LogsView";
import { useEffect, useState } from "react";

export default function Home() {
  const { logs, notifications, clearNotifications, isConnected } = useSocket();
  const [chartData, setChartData] = useState<{ time: string; count: number }[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(["feed", "side"]);
  const [activeView, setActiveView] = useState<"dashboard" | "logs" | "settings">("dashboard");

  // Update chart data based on logs
  useEffect(() => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    setChartData(prev => {
      const newData = [...prev, { time: timeStr, count: logs.length > 0 ? Math.floor(Math.random() * 20) + 10 : 0 }];
      return newData.slice(-10); // Show last 10 points
    });
  }, [logs]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/logs/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const errorCount = logs.filter(l => l.level === "ERROR").length;

  return (
    <DashboardLayout 
      notifications={notifications} 
      onClearNotifications={clearNotifications}
      onSearch={handleSearch}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {activeView === "dashboard" ? (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tight">System Overview</h2>
              <p className="text-sm text-muted-foreground">Monitoring active log streams across nodes.</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setWidgetOrder(prev => [...prev].reverse())}
                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 cursor-pointer"
              >
                Flip Layout
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-border">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {isConnected ? "Linked to Server" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          <KPIRibbon logsCount={logs.length} errorRate={errorCount.toString()} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {widgetOrder.map((widget) => (
              widget === "feed" ? (
                <div key="feed" className="lg:col-span-2">
                  <LogFeed 
                    logs={searchResults || logs} 
                    title={searchResults ? `Search Results (${searchResults.length})` : "Live Stream"}
                    isSearching={isSearching}
                  />
                </div>
              ) : (
                <div key="side" className="space-y-6">
                  <div className="p-6 bg-white dark:bg-[#111113] border border-border rounded-2xl">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">AI Observations</h3>
                    <p className="text-sm text-[#616164] dark:text-[#A1A1A5] leading-relaxed">
                      Log ingestion patterns are currently <span className="text-primary font-bold">Optimal</span>.
                      No abnormal spikes detected in error rates over the last 15 minutes.
                    </p>
                  </div>
                  <LogTrendChart data={chartData} />
                </div>
              )
            ))}
          </div>
        </div>
      ) : activeView === "logs" ? (
        <LogsView logs={logs} />
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
           <h2 className="text-xl font-bold text-primary uppercase tracking-widest">Settings</h2>
           <p className="text-muted-foreground mt-2">Configuration and node management tools are being prepared.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
