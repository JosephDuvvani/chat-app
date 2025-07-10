import { Chat } from "@/features/chats/db/chats";
import ChatItem from "./Chat";

export default function ChatList({ chatList }: { chatList: Chat[] }) {
  return (
    <div>
      {chatList.length > 0 ? (
        chatList.map((chat) => (
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
