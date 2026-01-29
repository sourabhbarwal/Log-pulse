"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface Notification {
  timestamp: string;
  level: string;
  message: string;
  source?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onClear?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onOpenChange, 
  notifications,
  onClear 
}) => {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[500px] p-0 border-l border-border bg-[#F8F9F9] dark:bg-[#0A0A0B]">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-8 border-b border-border bg-white dark:bg-[#111113]">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-sm font-bold uppercase tracking-widest text-[#4A4A2C] dark:text-[#E2E2D1] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Error History
              </SheetTitle>
              {notifications.length > 0 && isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClear}
                  className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1.5" />
                  Clear All
                </Button>
              )}
            </div>
            <SheetDescription className="text-xs text-muted-foreground mt-2">
              Review persistent critical alerts and system failures.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 overflow-y-auto px-6 py-4">
            {notifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <AlertCircle size={24} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">No alerts detected in this session.</p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {notifications.map((notif, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-[#111113] border border-border rounded-xl shadow-sm hover:border-primary/20 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg">
                        <AlertCircle size={14} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                            {notif.source || 'system'}
                          </span>
                          <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-[#4A4A2C] dark:text-[#E2E2D1] font-semibold tracking-tight">{notif.message}</p>
                        <p className="text-[11px] text-[#616164] dark:text-[#A1A1A5] leading-relaxed opacity-80 pt-1">
                          The system detected an intentional or non-responsive error state from the node.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-6 border-t border-border bg-white/50 dark:bg-[#111113]/50">
            <Button 
              className="w-full h-11 bg-primary hover:bg-[#4A4A2C] text-white font-bold text-xs uppercase tracking-widest transition-all rounded-xl shadow-sm"
              onClick={() => onOpenChange(false)}
            >
              Acknowledge & Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
