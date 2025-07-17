"use client";

import SendMessage from "@/features/chats/components/chatBox/SendMessage";
import { FullChat } from "@/features/chats/db/chats";
import ChatBoxMessages from "./ChatBoxMessages";
import ChatBoxHeader from "./ChatBoxHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/app/generated/prisma";
import { useSocket } from "@/components/providers/SocketProvider";
import ScrollToBottom from "./ScrollToBottom";

export default function ChatBox({ chat }: { chat: FullChat }) {
  const [chatMessages, setChatMessages] = useState<Message[]>(
    () => chat.messages
  );
  const [notification, setNotification] = useState(0);
  const socket = useSocket();
  const chatId = chat.id;
  const authUser = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return false;
    const boundry = 150;
    return el.scrollHeight - el.scrollTop - el.clientHeight < boundry;
  };

  useEffect(() => {
    if (!socket || !authUser) return;

    socket.emit("join-chat", chatId, authUser.name);

    return () => {
      socket.emit("leave-chat", chatId, authUser.id);
    };
  }, [socket, authUser?.id, chat.id]);

  useEffect(() => {
    if (!socket?.connect || !authUser) return;
    const handleMessage = (msg: Message) => {
      if (!isNearBottom() && msg.senderId !== authUser.id)
        setNotification((prev) => prev + 1);

      setChatMessages((prev) => [...prev, msg]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket?.connected, authUser?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [authUser]);

  useEffect(() => {
    if (isNearBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  if (!authUser) return null;

  const me = chat.users.find((user) => user.id === authUser.id);
  const receiver = chat.users.find((user) => user.id !== authUser.id);

  if (!me || !receiver) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 h-svh max-h-svh relative">
      <ChatBoxHeader receiver={receiver} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <ChatBoxMessages messages={chatMessages} users={{ me, receiver }} />
        <div ref={bottomRef} />
        <ScrollToBottom
          containerRef={scrollRef}
          bottomRef={bottomRef}
          isNearBottom={isNearBottom}
          notification={notification}
          setNotification={setNotification}
        />
      </div>

      <div className="sticky inset-x-0 bottom-0 px-4 py-2 bg-sky-100">
        <SendMessage chatId={chatId} receiverId={receiver.id} />
      </div>
    </div>
  );
}
