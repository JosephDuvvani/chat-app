import SendMessage from "@/features/chats/components/chatBox/SendMessage";

export default function OpenChat() {
  return (
    <div className="flex flex-col flex-1 h-svh relative">
      <div className="absolute inset-x-0 bottom-0 px-4 py-2 bg-sky-100">
        <SendMessage />
      </div>
    </div>
  );
}
