import ConnectForm from "@/features/users/components/connectBox/ConnectForm";
import { getUserById } from "@/features/users/db/users";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

export default async function ConnectWithUser({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const receiver = await getUserById(userId);

  if (!receiver) {
    return notFound();
  }

  return (
    <div>
      <div className="px-4 py-2">
        <div className="text-xl pb-1">Send a message to,</div>
        <div className="flex items-center">
          <div>
            <Image
              src={receiver.imageUrl || ""}
              width={30}
              height={30}
              className="rounded-full"
              alt=""
            />
          </div>
          <div className="flex-1 px-2">
            <div className="text-neutral-500">{receiver.name}</div>
          </div>
        </div>
        <ConnectForm receiverId={receiver.id} />
      </div>
    </div>
  );
}
