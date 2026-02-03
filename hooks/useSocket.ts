'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

export const useSocket = () => {
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
          setLogs(history);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    
    fetchHistory();

    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('new-log', (log) => {
      setLogs((prev) => [log, ...prev].slice(0, 50)); // Keep last 50 logs

      if (log.level === 'ERROR') {
        // Add to persistent notifications
        setNotifications((prev) => [log, ...prev].slice(0, 20));
        
        toast.error(`Critical Error: ${log.source || 'system'}`, {
          description: log.message,
          duration: 5000,
        });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
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

  return { socket, logs, notifications, clearNotifications, isConnected };
};
