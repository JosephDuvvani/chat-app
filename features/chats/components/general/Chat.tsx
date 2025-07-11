"use client";

import { Chat } from "@/features/chats/db/chats";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChatItemProps {
  chat: Chat;
}

export default function ChatItem({ chat }: ChatItemProps) {
  const user = chat.users[0];
  const message = chat.messages.length > 0 ? chat.messages[0].content : "";

  const pathname = usePathname();
  const isActive = pathname.includes(chat.id);

  return (
    <Link
      href={`/chats/${chat.id}`}
      className={`flex px-3 py-3 mx-1 outline-none hover:bg-sky-900 focus-visible:bg-sky-900 ${
        isActive ? "bg-sky-900" : ""
      }`}
    >
      <div className="flex-shrink-0">
        <Image
          src={user.imageUrl || ""}
          width={40}
          height={40}
          className="rounded-full"
          alt=""
        />
      </div>
      <div className="flex flex-col justify-between flex-1 pl-2 overflow-hidden">
        <div className="leading-4">{user.name}</div>
        <div className="text-[15px] text-neutral-500 leading-4 text-nowrap overflow-hidden text-ellipsis">
          {message}
        </div>
      </div>
    </Link>
  );
}
