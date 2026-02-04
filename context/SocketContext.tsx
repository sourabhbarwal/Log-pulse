"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface SocketContextType {
  socket: Socket | null;
  logs: any[];
  notifications: any[];
  clearNotifications: () => void;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initial fetch for historical logs (last 48h)
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/logs");
        if (res.ok) {
          const history = await res.json();
          // Keep a healthy buffer for historical logs
          setLogs(history.slice(0, 100)); 
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    
    fetchHistory();

    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    socketInstance.on('connect', () => {
      console.log('🛰️ Global Socket Connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('new-log', (log) => {
      setLogs((prev) => [log, ...prev].slice(0, 100)); // Keep last 100 logs globally

      if (log.level === 'ERROR') {
        setNotifications((prev) => [log, ...prev].slice(0, 20));
        
        toast.error(`Critical Error: ${log.source || 'system'}`, {
          description: log.message,
          duration: 5000,
        });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('📡 Global Socket Disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, logs, notifications, clearNotifications, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
