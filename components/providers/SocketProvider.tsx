"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/components/providers/AuthProvider";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const initialized = useRef(false);
  const user = useAuth();

  useEffect(() => {
    if (initialized.current) return;

    fetch("/api/socket/io");

    const socketIo = io({
      path: "/api/socket/io",
    });

    setSocket(socketIo);
    initialized.current = true;

    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("join-user", user.id);
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
