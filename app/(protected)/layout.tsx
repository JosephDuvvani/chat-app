import AuthProvider from "@/components/providers/AuthProvider";
import SocketProvider from "@/components/providers/SocketProvider";
import RightSidebar from "@/components/rightSidebar/RightSidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import { getUserByClerkId } from "@/features/users/db/users";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  const user = await getUserByClerkId(userId!);

  if (!user) return <div></div>;

  return (
    <SocketProvider>
      <AuthProvider user={user}>
        <div className="flex w-screen h-svh">
          <Sidebar />
          <main className="flex-1">{children}</main>
          <RightSidebar />
        </div>
      </AuthProvider>
    </SocketProvider>
  );
}
