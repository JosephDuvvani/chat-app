import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function RightSidebar() {
  return (
    <div className="flex flex-col bg-sky-950 text-sky-50 min-w-[300px]">
      <div>User Profile</div>
      <div className="flex-1"></div>
      <div className="flex p-4">
        <UserButton />
      </div>
    </div>
  );
}
