import Link from "next/link";
import Navbar from "./Navbar";
import ChatSearchForm from "@/features/chats/components/general/ChatSearchForm";
import { getChatListByClerkId } from "@/features/chats/db/chats";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatList from "@/features/chats/components/general/ChatList";

export default async function Sidebar() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const chatList = await getChatListByClerkId(userId, 0);

  return (
    <div className="flex flex-col bg-sky-950 text-sky-50 max-w-[350px]">
      <div className="flex flex-col pt-1 px-4 bg-sky-950/">
        <div className="flex mb-2">
          <Link
            href="/chats"
            className="py-2 px-4 rounded-full outline-none hover:bg-sky-900/50 focus-visible:bg-sky-900/50"
          >
            <h1 className="text-3xl font-bold">
              C
              <span className="hidden md:inline">
                hat<span className="text-amber-500">App</span>
              </span>
            </h1>
          </Link>
        </div>
        <div>
          <Navbar />
        </div>
        <ChatSearchForm />
      </div>
      <div className="overflow-y-auto scrollbar h-[calc(100svh-170px)] pt-6 pb-20">
        <ChatList chatList={chatList} />
      </div>
    </div>
  );
}
