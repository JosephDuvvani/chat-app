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
        messages: [{ content: msg.content }],
      };

      setChats((prev) => [
        updatedChat,
        ...prev.filter((chat) => chat.id !== msg.chatId),
      ]);
    };

    const handleChat = (chat: Chat) => {
      setChats((prev) => [chat, ...prev]);
    };

    socket.on("last-message", handleMessage);
    socket.on("new-chat", handleChat);

    return () => {
      socket.off("last-message", handleMessage);
      socket.off("new-chat", handleChat);
    };
  }, [socket]);

  return (
    <div>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.id}>
            <ChatItem chat={chat} />
          </div>
        ))
      ) : (
        <div className="flex justify-center">
          <span className="text-xl text-sky-100/70">No Chats</span>
        </div>
      )}
    </div>
  );
}
