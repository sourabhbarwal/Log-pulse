"use client";

import React from "react";
import { 
  Activity, 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Search,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationPanel from "./NotificationPanel";

interface DashboardLayoutProps {
  children: React.ReactNode;
  notifications?: any[];
  onClearNotifications?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  notifications = [], 
  onClearNotifications 
}) => {
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Navigation Rail */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-border bg-[#F8F9F9]">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-10 shadow-sm">
          <Activity className="text-white w-6 h-6" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-8">
          <NavItem icon={<LayoutDashboard size={20} />} active />
          <NavItem icon={<FileText size={20} />} />
          <NavItem 
            icon={
              <div className="relative">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-[#F8F9F9]">
                    {notifications.length}
                  </span>
                )}
              </div>
            } 
            onClick={() => setIsNotifOpen(true)}
          />
        </nav>
        
        <div className="mt-auto">
          <NavItem icon={<Settings size={20} />} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-[#4A4A2C] tracking-tight uppercase">LogPulse <span className="text-[#A09C5E] font-normal lowercase opacity-70">/ real-time monitoring</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="bg-[#F1F3F3] border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary/20 border border-border flex items-center justify-center text-[10px] font-bold text-secondary-foreground">
              JS
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        <NotificationPanel 
          isOpen={isNotifOpen} 
          onOpenChange={setIsNotifOpen} 
          notifications={notifications}
          onClear={onClearNotifications}
        />
      </main>
    </div>
  );
};

const NavItem = ({ 
  icon, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={cn(
      "p-2.5 rounded-xl transition-all duration-200 cursor-pointer",
      active 
        ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/5" 
        : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
    )}
  >
    {icon}
  </button>
);

export default DashboardLayout;
