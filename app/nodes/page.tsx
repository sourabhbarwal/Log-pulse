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

        {/* Developer Integration Card */}
        <Card className="p-10 bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
            <Zap size={150} className="text-primary" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={20} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Developer Quickstart</span>
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tighter">Connect your fleet in seconds.</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Copy your API Key and send a POST request from any language. 
                LogPulse handles the heavy lifting of high-throughput ingestion.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-black/50 rounded-2xl p-6 border border-slate-800 shadow-inner">
                <pre className="text-[10px] md:text-xs text-emerald-400 font-mono overflow-x-auto">
                  <code>{`curl -X POST https://your-domain.com/api/logs/ingest \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "level": "ERROR",
    "message": "Payment system failed",
    "details": { "node": "db-01" }
  }'`}</code>
                </pre>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
