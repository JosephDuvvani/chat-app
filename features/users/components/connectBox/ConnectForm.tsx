"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useSocket } from "@/components/providers/SocketProvider";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";

export default function ConnectForm({ receiverId }: { receiverId: string }) {
  const router = useRouter();
  const socket = useSocket();
  const authUser = useAuth();
  const senderId = authUser?.id;

  useEffect(() => {
    if (!socket) return;

    const handleRedirect = ({ chatId }: { chatId: string }) => {
      router.push(`/chats/${chatId}`);
    };

    socket.on("redirect_to_chat", handleRedirect);

    return () => {
      socket.off("redirect_to_chat", handleRedirect);
    };
  }, [socket]);

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket || !senderId) return;
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message")?.toString().trim();

    if (!message || message.length === 0) return;

    socket.emit("connect-message", {
      content: message,
      receiverId,
      senderId,
    });
  };

  return (
    <form onSubmit={handleSend} className="flex flex-col max-w-2xl mx-auto">
      <input
        type="text"
        name="message"
        placeholder="Write message..."
        className="p-3 mt-4 bg-amber-50 border-1 border-amber-100 rounded-md outline-none focus:border-amber-200"
        autoComplete="off"
        autoFocus
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-rose-800 text-red-50 px-4 py-1.5 my-4 rounded-lg cursor-pointer outline-none hover:bg-rose-900 focus-visible:bg-rose-900 transition-colors"
        >
          Send
        </button>
      </div>
    </form>
  );
}
