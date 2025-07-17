import { Server as NetServer } from "http";
import { Server as IOServer } from "socket.io";
import type { NextApiRequest } from "next";

import {
  ConnectMessage,
  ChatMessage,
  NextApiResponseWithSocket,
} from "@/types";
import {
  Chat,
  chatExists,
  createChat,
  isChatUser,
} from "@/features/chats/db/chats";
import { createMessage } from "@/features/chats/db/messages";
import { getUserById } from "@/features/users/db/users";
import { updateLastSeenAt } from "@/features/chats/db/chatUser";

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
      socket.on("join-user", (userId: string) => {
        console.log("User connected:", userId);
        socket.join(userId);
      });

      socket.on("join-chat", (chatId: string, name: string) => {
        if (!socket.rooms.has(chatId)) {
          socket.join(chatId);
          console.log(`${name} joined chat: ${chatId}`);
        }
      });

      socket.on("leave-chat", async (chatId: string, userId: string) => {
        const chatUser = await updateLastSeenAt(userId, chatId);
        io.to(userId).emit("last-seen-at", {
          chatId,
          userId,
          lastSeenAt: chatUser.lastSeenAt,
        });
        if (process.env.NODE_ENV === "production") {
          socket.leave(chatId);
        }
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
          io.to([senderId, receiverId]).emit("last-message", message);
          socket.emit("redirect_to_chat", { chatId });
        } else {
          const newChat = await createChat(senderId, receiverId);
          const message = await createMessage({
            chatId: newChat.id,
            senderId,
            content,
          });
          const userA = await getUserById(senderId);
          const userB = await getUserById(receiverId);

          if (!userA || !userB) throw new Error("User record not found");
          const users = [userA, userB].map((user) => ({
            user: {
              id: user.id,
              name: user?.name,
              imageUrl: user?.imageUrl,
              clerkId: user.clerkId,
            },
            lastSeenAt: null,
          }));
          const chat: Chat = {
            id: newChat.id,
            createdAt: newChat.createdAt,
            updatedAt: newChat.updatedAt,
            messages: [message],
            users,
          };

          io.to(senderId).emit("new-chat", chat);
          io.to(receiverId).emit("new-chat", { ...chat, users: [users[0]] });
          socket.emit("redirect_to_chat", { chatId: newChat.id });
        }
      });

      socket.on("message", async (msg: ChatMessage, receiverId: string) => {
        const { senderId, chatId } = msg;
        const isInChat = await isChatUser(senderId, chatId);
        if (isInChat) {
          const message = await createMessage(msg);
          io.to(chatId).emit("message", message);
          io.to([senderId, receiverId]).emit("last-message", message);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
  res.end();
}
