import ChatBox from "@/features/chats/components/chatBox/ChatBox";
import { getChat } from "@/features/chats/db/chats";
import { notFound } from "next/navigation";

interface OpenChatProps {
  params: {
    chatId: string;
  };
}

export default async function OpenChat({ params }: OpenChatProps) {
  const { chatId } = params;
  const chat = await getChat(chatId);

  if (!chat) {
    return notFound();
  }

  return <ChatBox chat={chat} />;
}
