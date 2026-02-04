"use client";

import { Activity, Github, Lock, User } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid credentials");
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account created! Please sign in.");
        setActiveTab("login");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
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
          
          {/* Tabs */}
          <div className="flex bg-[#F1F3F3] dark:bg-slate-900 p-1 rounded-xl mt-6 w-full max-w-[240px]">
            <button 
              onClick={() => setActiveTab("login")}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                activeTab === "login" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-muted-foreground"
              )}
            >
              Sign In
            </button>
            <button 
              onClick={() => setActiveTab("signup")}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                activeTab === "signup" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-muted-foreground"
              )}
            >
              Join
            </button>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "login" ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@logpulse.dev"
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
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#F1F3F3] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all outline-none text-foreground dark:text-[#E2E2D1]"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                <div className="relative group">
                  <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
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
                    placeholder="Create Password"
                    className="w-full bg-[#F1F3F3] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all outline-none text-foreground dark:text-[#E2E2D1]"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Creating Account..." : "Register Now"}
              </button>
            </form>
          )}
        </motion.div>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border dark:border-slate-800"></div>
          </div>
          <span className="bg-white dark:bg-[#111113] px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] relative">Alternatively</span>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full bg-[#181717] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all border border-transparent"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-white dark:bg-slate-800 text-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-border"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-[10px] text-center text-muted-foreground mt-8 uppercase tracking-widest leading-loose">
          Authorized personnel only.<br/>
          LogPulse Security Protocol v2.4.0
        </p>
      </motion.div>
    </div>
  );
}
