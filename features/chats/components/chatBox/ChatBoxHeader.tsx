import BackButton from "@/components/buttons/BackButton";
import { Person } from "@/features/users/db/users";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function ChatBoxHeader({
  receiver,
}: {
  receiver: Omit<Person, "email">;
}) {
  return (
    <div className="flex items-center px-4 py-2 border-b-1 border-b-neutral-200 sticky top-0 inset-x-0">
      <BackButton className="flex p-1 rounded-full mr-2 ml-[-8px] cursor-pointer outline-none hover:bg-sky-100 focus-visible:bg-sky-100">
        <ArrowLeft size={20} />
      </BackButton>

      <div>
        <Image
          src={receiver.imageUrl || ""}
          width={35}
          height={35}
          className="rounded-full"
          alt=""
        />
      </div>

      <div className="flex-1 px-2">
        <div className="text-neutral-800 text-lg font-semibold">
          {receiver.name}
        </div>
      </div>
    </div>
  );
}
