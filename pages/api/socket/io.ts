import { Server as NetServer } from "http";
import { Server as IOServer } from "socket.io";
import type { NextApiRequest } from "next";

import {
  ConnectMessage,
  ChatMessage,
  NextApiResponseWithSocket,
} from "@/types";
import { chatExists, createChat, isChatUser } from "@/features/chats/db/chats";
import { createMessage } from "@/features/chats/db/messages";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function socketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;

    const io = new IOServer(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join-chat", (chatId: string, name: string) => {
        socket.join(chatId);
        console.log(`${name} joined chat: ${chatId}`);
      });

      socket.on("leave-chat", (chatId: string, name: string) => {
        socket.leave(chatId);
        console.log(`${name} left chat: ${chatId}`);
      });

      socket.on("connect-message", async (msg: ConnectMessage) => {
        const { content, receiverId, senderId } = msg;
        const haveChat = await chatExists(senderId, receiverId);

        if (haveChat) {
          const { chatId } = haveChat;
          const message = await createMessage({
            chatId,
            senderId,
            content,
          });

          socket.to(chatId).emit("message", message);
          socket.emit("redirect_to_chat", { chatId });
        } else {
          const newChat = await createChat(senderId, receiverId);
          const message = await createMessage({
            chatId: newChat.id,
            senderId,
            content,
          });

          socket.emit("redirect_to_chat", { chatId: newChat.id });
        }
      });

      socket.on("message", async (msg: ChatMessage) => {
        const { senderId, chatId } = msg;
        const isInChat = await isChatUser(senderId, chatId);
        if (isInChat) {
          const message = await createMessage(msg);
          io.to(chatId).emit("message", message);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
  res.end();
}
