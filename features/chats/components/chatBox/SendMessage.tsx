"use client";

import { SendIcon } from "lucide-react";
import { useSocket } from "@/components/providers/SocketProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { FormEvent } from "react";

interface SendMessageProps {
  chatId: string;
}

export default function SendMessage({ chatId }: SendMessageProps) {
  const socket = useSocket();
  const authUser = useAuth();
  const senderId = authUser?.id;

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket || !senderId) return;
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message")?.toString().trim();

    if (!message || message.length === 0) return;

    const msg = {
      content: message,
      chatId,
      senderId,
    };
    socket.emit("message", msg);

    e.currentTarget.reset();
  };

  return (
    <>
      <form onSubmit={handleSend} className="flex">
        <input
          className="flex-1 outline-none bg-sky-900 text-sky-50 py-2 px-4 rounded-full mr-2"
          type="text"
          name="message"
          placeholder="Send Message..."
          autoComplete="off"
        />
        <button
          type="submit"
          className="text-sky-500 p-2 rounded-full outline-none focus-visible:bg-sky-200 hover:bg-sky-200 transition-colors cursor-pointer"
        >
          <SendIcon />
        </button>
      </form>
    </>
  );
}
