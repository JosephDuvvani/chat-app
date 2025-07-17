"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Chat } from "@/features/chats/db/chats";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChatItemProps {
  chat: Chat;
}

export default function ChatItem({ chat }: ChatItemProps) {
  const authUser = useAuth();
  const pathname = usePathname();

  if (!authUser) return null;

  const { user } = chat.users.filter(
    (data) => data.user.id !== authUser.id
  )?.[0];
  const { lastSeenAt } = chat.users.filter(
    (data) => data.user.id === authUser?.id
  )?.[0];

  const message = chat.messages.length > 0 ? chat.messages[0] : null;
  const hasUnseen =
    message?.createdAt &&
    lastSeenAt &&
    !pathname?.includes(chat.id) &&
    message.senderId !== authUser.id
      ? new Date(message.createdAt) > lastSeenAt
      : false;

  const isActive = pathname?.includes(chat.id);

  return (
    <Link
      href={`/chats/${chat.id}`}
      className={`flex px-3 py-3 mx-1 outline-none hover:bg-sky-900 focus-visible:bg-sky-900 ${
        isActive ? "bg-sky-900" : ""
      } ${hasUnseen && "bg-green-500/30"}`}
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
        <div className="flex justify-between">
          <span className="leading-4 mr-3 truncate">{user.name}</span>
          {message && (
            <span className="text-sm text-nowrap">
              {formatDistanceToNowStrict(message.createdAt)}
            </span>
          )}
        </div>
        <div className="text-[15px] text-neutral-500 leading-4 truncate">
          {message?.content || ""}
        </div>
      </div>
    </Link>
  );
}
