import ChatBox from "@/features/chats/components/chatBox/ChatBox";

interface OpenChatProps {
  params: {
    chatId: string;
  };
}

export default function OpenChat({ params }: OpenChatProps) {
  const { chatId } = params;

  return <ChatBox chatId={chatId} />;
}
