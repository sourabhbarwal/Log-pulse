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
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, ChevronRight } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [lastReadTime, setLastReadTime] = React.useState<number>(0);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const unreadCount = notifications.filter(
    (n) => new Date(n.timestamp).getTime() > lastReadTime
  ).length;

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const currentView = activeView as any;

  return (
    <div className="flex h-screen bg-[#FDFDFD] dark:bg-[#0A0A0B] text-foreground overflow-hidden font-sans relative">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      {/* Navigation Rail - Hidden on mobile, shown on md+ */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-16 flex flex-col items-center py-6 border-r border-border bg-[#F8F9F9] dark:bg-[#111113] transition-transform duration-300 md:static md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-10 shadow-sm border border-primary/20">
          <Activity className="text-white w-6 h-6" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-8">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            active={currentView === "dashboard" && pathname === '/'}
            onClick={() => {
              if (pathname !== '/') {
                router.push('/');
              } else {
                onViewChange?.("dashboard");
              }
            }} 
            title="Overview"
          />
          <NavItem 
            icon={<FileText size={20} />} 
            active={currentView === "logs" || (pathname === '/' && currentView === 'logs')}
            onClick={() => {
              if (pathname !== '/') {
                router.push('/?view=logs');
              } else {
                onViewChange?.("logs");
              }
            }} 
            title="Global Logs"
          />
          <NavItem 
            icon={<Server size={20} />} 
            active={pathname === '/nodes'}
            onClick={() => router.push('/nodes')} 
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
            active={currentView === "settings" || pathname === '/health'}
            onClick={() => router.push('/health')} 
            title="System Health & Settings"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-white/50 dark:bg-[#0A0A0B]/50 backdrop-blur-sm relative z-[60]">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-muted-foreground hover:text-primary transition-colors"
            >
              <Activity className="w-6 h-6" />
            </button>
            <h1 className="text-sm md:text-lg font-bold text-[#4A4A2C] dark:text-[#E2E2D1] tracking-tight uppercase truncate max-w-[120px] md:max-w-none">
              LogPulse 
              <span className="hidden sm:inline text-primary font-light lowercase opacity-80 text-xs ml-2">/ real-time monitoring</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="bg-[#F1F3F3] dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-xs md:text-sm w-32 md:w-64 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            
            <ThemeToggle />

            <div 
              className="relative"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] md:text-xs font-bold text-primary shadow-sm overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>

              {/* Professional Profile Hover Card */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-3 w-72 z-[100]"
                  >
                    <div className="bg-white dark:bg-[#111113] border border-border rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                      <div className="p-5 bg-primary/5 border-b border-border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white text-lg font-black shadow-lg shadow-primary/20">
                            {userInitials}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-[#4A4A2C] dark:text-[#E2E2D1] truncate">{session?.user?.name || "Anonymous"}</h4>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black tabular-nums">
                              {(session?.user as any)?.role || "ADMIN"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2 space-y-1">
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <Mail size={16} className="text-muted-foreground" />
                          <div className="overflow-hidden">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Email Address</p>
                            <p className="text-xs font-medium truncate">{session?.user?.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <Shield size={16} className="text-muted-foreground" />
                          <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Account Status</p>
                            <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                              Verified <Activity size={10} />
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-border">
                          <button 
                            onClick={() => signOut()}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 transition-all group/btn"
                          >
                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                              <LogOut size={16} />
                              Sign Out
                            </div>
                            <ChevronRight size={14} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
