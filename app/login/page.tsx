"use client";

import { Activity, Github, Lock, User } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/",
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0B] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Theme Toggle Positioned Top Right */}
      <div className="absolute top-6 right-8 z-50">
        <ThemeToggle />
      </div>
      {/* Background Polish */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[size:48px_48px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 dark:bg-secondary/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#111113] border border-border/60 dark:border-border shadow-2xl rounded-3xl p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Activity className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground dark:text-[#E2E2D1] tracking-tight">LogPulse Access</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Enter credentials to view secure log streams</p>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#F1F3F3] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all outline-none text-foreground dark:text-[#E2E2D1]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F1F3F3] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all outline-none text-foreground dark:text-[#E2E2D1]"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border dark:border-slate-800"></div>
          </div>
          <span className="bg-white dark:bg-[#111113] px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] relative">Alternatively</span>
        </div>

        <button 
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="w-full bg-foreground dark:bg-slate-800 text-background dark:text-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700"
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>

        <p className="text-[10px] text-center text-muted-foreground mt-8 uppercase tracking-widest leading-loose">
          Authorized personnel only.<br/>
          LogPulse Security Protocol v2.4.0
        </p>
      </motion.div>
    </div>
  );
}
