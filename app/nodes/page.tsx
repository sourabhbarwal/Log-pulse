"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Plus, Server, Key, Copy, Check, Trash2, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NodesPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"curl" | "powershell">("curl");
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  const fetchNodes = async () => {
    try {
      const res = await fetch("/api/nodes");
      const data = await res.json();
      setNodes(data);
    } catch (err) {
      toast.error("Failed to load nodes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const handleAddNode = async () => {
    if (!newNodeName.trim()) return;
    try {
      const res = await fetch("/api/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newNodeName }),
      });
      if (res.ok) {
        const node = await res.json();
        setNodes([node, ...nodes]);
        setNewNodeName("");
        setIsAdding(false);
        toast.success("Node added successfully!");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add node");
      }
    } catch (err) {
      toast.error("Error adding node");
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("API Key copied!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const res = await fetch("/api/nodes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setNodes(nodes.map(n => n._id === id ? { ...n, status: newStatus } : n));
        toast.info(`Server ${newStatus === "active" ? "Activated" : "Paused"}`);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteNode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this server? Historical logs will persist but future ingestion will fail.")) return;
    try {
      const res = await fetch(`/api/nodes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setNodes(nodes.filter(n => n._id !== id));
        toast.success("Server removed from fleet");
      }
    } catch (err) {
      toast.error("Failed to delete server");
    }
  };

  return (
    <DashboardLayout activeView="settings">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tighter uppercase">Server Fleet 🚀</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage external servers and ingestion tokens.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={16} /> Add New Server
          </button>
        </header>

        {isAdding && (
          <Card className="p-6 bg-white dark:bg-[#111113] border-2 border-primary/20 border-dashed animate-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                autoFocus
                type="text" 
                placeholder="Enter server name (e.g. Auth-Service-01)" 
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                className="flex-1 bg-[#F1F3F3] dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleAddNode}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  Create Key
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-muted-foreground px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground animate-pulse">Initializing fleet monitor...</div>
          ) : nodes.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-border">
              <Server className="mx-auto text-muted-foreground/30 mb-4" size={48} />
              <p className="text-muted-foreground">No servers connected yet. Add your first node to start ingest.</p>
            </div>
          ) : (
            nodes.map((node) => (
              <Card key={node._id} className="p-6 bg-white dark:bg-[#111113] border-border shadow-none hover:border-primary/30 transition-all group overflow-hidden relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <Server size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tight">{node.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn(
                          "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest",
                          node.status === "active" ? "text-emerald-500" : "text-amber-500"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", node.status === "active" ? "bg-emerald-500" : "bg-amber-500")} />
                          {node.status}
                        </span>
                        <button 
                          onClick={() => toggleStatus(node._id, node.status)}
                          className={cn(
                            "ml-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter transition-all",
                            node.status === "active" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white" : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                          )}
                        >
                          {node.status === "active" ? "Pause Ingest" : "Resume Ingest"}
                        </button>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Last ingestion: {node.lastIngestAt ? new Date(node.lastIngestAt).toLocaleTimeString() : "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-md">
                    <div className="bg-[#F1F3F3] dark:bg-slate-900/50 rounded-xl p-3 flex items-center justify-between border border-border/50">
                      <div className="flex items-center gap-2 truncate">
                        <Key size={14} className="text-primary shrink-0" />
                        <code className="text-[11px] font-mono text-muted-foreground truncate">
                          {node.apiKey.slice(0, 10)}******************
                        </code>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(node.apiKey)}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-primary transition-all cursor-pointer"
                      >
                        {copiedKey === node.apiKey ? <Check size={16} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => deleteNode(node._id)}
                      className="p-2.5 text-muted-foreground hover:text-rose-500 transition-all cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="p-10 bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
            <Zap size={150} className="text-primary" />
          </div>
          <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-start">
            <div className="space-y-6 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Developer Quickstart</span>
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tighter leading-tight">Connect your fleet<br/>in seconds.</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                LogPulse ingestion is language agnostic. Copy your server's API Key and use our standard JSON endpoint to start streaming instantly.
              </p>
              
              <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg w-fit border border-slate-800">
                <button 
                  onClick={() => setActiveTab("curl")}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === "curl" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  cURL
                </button>
                <button 
                  onClick={() => setActiveTab("powershell")}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === "powershell" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  PowerShell
                </button>
              </div>
            </div>
            
            <div className="flex-[1.5] w-full">
              <div className="bg-black/60 rounded-2xl p-6 border border-slate-800 shadow-2xl backdrop-blur-xl relative group/code">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
                <pre className="text-[11px] md:text-xs text-emerald-400/90 font-mono overflow-x-auto min-h-[140px] flex items-center">
                  <code className="w-full">
                    {activeTab === "curl" ? (
                      <>
                        <span className="text-indigo-400">curl</span> -X <span className="text-amber-400">POST</span> {baseUrl}/api/logs/ingest \<br/>
                        &nbsp;&nbsp;-H <span className="text-emerald-300">"Content-Type: application/json"</span> \<br/>
                        &nbsp;&nbsp;-H <span className="text-emerald-300">"x-api-key: YOUR_API_KEY"</span> \<br/>
                        &nbsp;&nbsp;-d <span className="text-slate-400">'{`{
    "level": "ERROR",
    "message": "System failure detected",
    "details": { "service": "api-gateway" }
  }`}</span>'
                      </>
                    ) : (
                      <>
                        <span className="text-indigo-400">Invoke-RestMethod</span> -Uri <span className="text-emerald-300">"{baseUrl}/api/logs/ingest"</span> `<br/>
                        &nbsp;&nbsp;-Method <span className="text-amber-400">Post</span> `<br/>
                        &nbsp;&nbsp;-Headers <span className="text-slate-300">@{"{"}</span>"x-api-key"=<span className="text-emerald-300">"YOUR_KEY"</span><span className="text-slate-300">{"}"}</span> `<br/>
                        &nbsp;&nbsp;-ContentType <span className="text-emerald-300">"application/json"</span> `<br/>
                        &nbsp;&nbsp;-Body <span className="text-slate-400">'{"{"}"level": "ERROR", "message": "Failure"{"}"}'</span>
                      </>
                    )}
                  </code>
                </pre>
                
                <button 
                  onClick={() => {
                    const text = activeTab === "curl" 
                      ? `curl -X POST ${baseUrl}/api/logs/ingest -H "Content-Type: application/json" -H "x-api-key: YOUR_API_KEY" -d '{"level": "ERROR", "message": "System failure detected"}'`
                      : `Invoke-RestMethod -Uri "${baseUrl}/api/logs/ingest" -Method Post -Headers @{"x-api-key"="YOUR_KEY"} -ContentType "application/json" -Body '{"level": "ERROR", "message": "System failure detected"}'`;
                    navigator.clipboard.writeText(text);
                    toast.success(`${activeTab === "curl" ? "cURL" : "PowerShell"} snippet copied!`);
                  }}
                  className="absolute bottom-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all opacity-0 group-hover/code:opacity-100"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
