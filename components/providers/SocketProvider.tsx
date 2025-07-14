"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const initialized = useRef(false);

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

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
