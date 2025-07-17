"use client";

import { Chat } from "@/features/chats/db/chats";
import ChatItem from "./Chat";
import { useEffect, useState } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { Message } from "@/app/generated/prisma";

export default function ChatList({ chatList }: { chatList: Chat[] }) {
  const [chats, setChats] = useState<Chat[]>(chatList);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg: Message) => {
      const oldChat = chats.find((chat) => chat.id === msg.chatId);

      if (!oldChat) return;

      const updatedChat: Chat = {
        ...oldChat,
        messages: [msg],
      };

      setChats((prev) => [
        updatedChat,
        ...prev.filter((chat) => chat.id !== msg.chatId),
      ]);
    };

    const handleChat = (chat: Chat) => {
      setChats((prev) => [chat, ...prev]);
    };

    const handleLastSeenAt = (data: {
      chatId: string;
      userId: string;
      lastSeenAt: Date;
    }) => {
      const oldChat = chats.find((chat) => chat.id === data.chatId);

      if (!oldChat) return;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.chatId
            ? {
                ...chat,
                users: chat.users.map((userData) =>
                  userData.user.id === data.userId
                    ? { ...userData, lastSeenAt: data.lastSeenAt }
                    : userData
                ),
              }
            : chat
        )
      );
    };

    socket.on("last-message", handleMessage);
    socket.on("last-seen-at", handleLastSeenAt);
    socket.on("new-chat", handleChat);

    return () => {
      socket.off("last-message", handleMessage);
      socket.off("last-seen-at", handleLastSeenAt);
      socket.off("new-chat", handleChat);
    };
  }, [socket]);

  return (
    <div>
      {chats.length > 0 ? (
        <div className="flex flex-col gap-1">
          {chats.map((chat) => (
            <div key={chat.id}>
              <ChatItem chat={chat} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <span className="text-xl text-sky-100/70">No Chats</span>
        </div>
      )}
    </div>
  );
}
