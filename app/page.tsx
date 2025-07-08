import { SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/chats");
  }
  return (
    <>
      <SignedOut>
        <div className="flex flex-col justify-center items-center gap-6 min-h-svh">
          <h1 className="text-4xl font-bold">
            Chat<span className="text-amber-500">App</span>
          </h1>
          <div className="flex flex-col gap-6 border-1 border-indigo-100 rounded- p-6 min-w-[300px]">
            <Link
              href=" /sign-up"
              className="px-3 py-2 rounded-lg bg-indigo-500 text-center"
            >
              Create account
            </Link>
            <Link
              href=" /sign-in"
              className="px-3 py-2 border-1 border-indigo-300 rounded-lg text-center"
            >
              Log in
            </Link>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
