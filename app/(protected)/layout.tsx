import RightSidebar from "@/components/rightSidebar/RightSidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-screen h-svh">
      <Sidebar />
      <main className="flex-1">{children}</main>
      <RightSidebar />
    </div>
  );
}
