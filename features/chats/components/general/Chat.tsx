import { Chat } from "@/features/chats/db/chats";
import Image from "next/image";

export default function ChatItem({ chat }: { chat: Chat }) {
  const user = chat.users[0];
  const message = chat.messages.length > 0 ? chat.messages[0].content : "";

  return (
    <div>
      <div className="flex items-center">
        <div>
          <Image
            src={user.imageUrl || ""}
            width={30}
            height={30}
            className="rounded-full"
            alt=""
          />
        </div>
        <div className="flex-1 px-2">
          <div className="text-neutral-500">{user.name}</div>
          <div>
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
