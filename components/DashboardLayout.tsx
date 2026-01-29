"use client";

import React from "react";
import { 
  Activity, 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Search,
  Bell,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationPanel from "./NotificationPanel";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  notifications?: any[];
  onClearNotifications?: () => void;
  onSearch?: (query: string) => void;
  activeView?: "dashboard" | "logs" | "settings";
  onViewChange?: (view: "dashboard" | "logs" | "settings") => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  notifications = [], 
  onClearNotifications,
  onSearch,
  activeView = "dashboard",
  onViewChange
}) => {
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [lastReadTime, setLastReadTime] = React.useState<number>(0);
  const { data: session } = useSession();

  const unreadCount = notifications.filter(
    (n) => new Date(n.timestamp).getTime() > lastReadTime
  ).length;

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("")
    : "??";

  return (
    <div className="flex h-screen bg-[#FDFDFD] dark:bg-[#0A0A0B] text-foreground overflow-hidden font-sans relative">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      {/* Navigation Rail */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-border bg-[#F8F9F9] dark:bg-[#111113]">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-10 shadow-sm border border-primary/20">
          <Activity className="text-white w-6 h-6" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-8">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            active={activeView === "dashboard"}
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/';
              } else {
                onViewChange?.("dashboard");
              }
            }} 
            title="Overview"
          />
          <NavItem 
            icon={<FileText size={20} />} 
            active={activeView === "logs"}
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/?view=logs';
              } else {
                onViewChange?.("logs");
              }
            }} 
            title="Global Logs"
          />
          <NavItem 
            icon={<Server size={20} />} 
            active={window.location.pathname === '/nodes'}
            onClick={() => window.location.href = '/nodes'} 
            title="Server Fleet"
          />
          <NavItem 
            icon={
              <div className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-[#F8F9F9] dark:border-[#111113]">
                    {unreadCount}
                  </span>
                )}
              </div>
            } 
            onClick={() => setIsNotifOpen(true)}
          />
        </nav>
        
        <div className="mt-auto">
          <NavItem 
            icon={<Settings size={20} />} 
            active={activeView === "settings"}
            onClick={() => window.location.href = '/health'} 
            title="System Health & Settings"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-white/50 dark:bg-[#0A0A0B]/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tight uppercase">
              LogPulse 
              <span className="text-primary font-light lowercase opacity-80 text-xs ml-2">/ real-time monitoring</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="bg-[#F1F3F3] dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            
            <ThemeToggle />

            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative z-10">
          {children}
        </div>

        <NotificationPanel 
          isOpen={isNotifOpen} 
          onOpenChange={setIsNotifOpen} 
          notifications={notifications}
          onClear={onClearNotifications}
          onAcknowledge={() => {
            setLastReadTime(Date.now());
            setIsNotifOpen(false);
          }}
        />
      </main>
    </div>
  );
};

const NavItem = ({ 
  icon, 
  active = false, 
  onClick,
  title
}: { 
  icon: React.ReactNode; 
  active?: boolean;
  onClick?: () => void;
  title?: string;
}) => (
  <button 
    onClick={onClick}
    title={title}
    className={cn(
      "p-2.5 rounded-xl transition-all duration-200 cursor-pointer",
      active 
        ? "bg-primary/10 dark:bg-primary/20 text-primary shadow-sm ring-1 ring-primary/5 dark:ring-primary/20" 
        : "text-muted-foreground hover:bg-secondary/10 dark:hover:bg-slate-800 hover:text-foreground dark:hover:text-white"
    )}
  >
    {icon}
  </button>
);

export default DashboardLayout;
