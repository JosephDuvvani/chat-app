import SendMessage from "@/features/chats/components/chatBox/SendMessage";
import { getChat } from "@/features/chats/db/chats";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import ChatBoxMessages from "./ChatBoxMessages";
import ChatBoxHeader from "./ChatBoxHeader";

export default async function ChatBox({ chatId }: { chatId: string }) {
  const { userId } = await auth();
  const chat = await getChat(chatId);

  if (!chat) {
    return notFound();
  }

  const { users, messages } = chat;
  const me = users.find((user) => user.clerkId === userId);
  const receiver = users.find((user) => user.clerkId !== userId);

  if (!me || !receiver) {
    throw new Error("Chat users unidentified");
  }

  return (
    <div className="flex flex-col flex-1 h-svh max-h-svh relative">
      <ChatBoxHeader receiver={receiver} />

      <div className="flex-1 overflow-auto px-4">
        <ChatBoxMessages messages={messages} users={{ me: me, receiver }} />
      </div>

      <div className="sticky inset-x-0 bottom-0 px-4 py-2 bg-sky-100">
        <SendMessage chatId={chat.id} />
      </div>
    </div>
  );
}
