import { Server as NetServer, Socket } from "net";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export type ConnectMessage = {
  content: string;
  receiverId: string;
  senderId: string;
};

export type ChatMessage = {
  chatId: string;
  senderId: string;
  content: string;
};
