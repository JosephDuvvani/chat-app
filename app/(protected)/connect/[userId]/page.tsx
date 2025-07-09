import ConnectForm from "@/features/users/components/connectBox/ConnectForm";
import { getUserById } from "@/features/users/db/users";
import Image from "next/image";
import React from "react";

export default async function ConnectWithUser({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserById(params.userId);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <div className="px-4 py-2">
        <div className="text-xl pb-1">Send a message to,</div>
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
          </div>
        </div>
        <ConnectForm receiverId={user.id} />
      </div>
    </div>
  );
}
