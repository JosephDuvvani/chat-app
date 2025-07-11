import { Message } from "@/features/chats/db/chats";
import { Person } from "@/features/users/db/users";
import { format } from "date-fns";
import Image from "next/image";

interface MessageBoxProps {
  message: Message;
  isSender: boolean;
  sender: Omit<Person, "email">;
}

export default function MessageBox({
  message,
  isSender,
  sender,
}: MessageBoxProps) {
  return (
    <div
      className={`flex items-end py-2 ${
        isSender ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="flex flex-col items-center gap-1 mx-1">
        <Image
          src={sender.imageUrl || ""}
          width={30}
          height={30}
          className="rounded-full"
          alt=""
        />
        <div className="text-xs text-nowrap">
          {format(message.createdAt, "HH:mm aa")}
        </div>
      </div>

      <div className="max-w-[70%]">
        <div
          className={`p-3  text-white rounded-2xl ${
            isSender
              ? "bg-violet-500 rounded-br-none"
              : "bg-blue-500 rounded-bl-none"
          }`}
        >
          {message.content}
        </div>
        <div className="h-8"></div>
      </div>
    </div>
  );
}
