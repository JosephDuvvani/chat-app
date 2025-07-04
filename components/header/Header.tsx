"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    title: "Chats",
    href: "/chats",
  },
  {
    title: "Connect",
    href: "/connect",
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center gap-4 px-4 py-1 border-b-1 border-neutral-800">
      <Link href="/">
        <h1 className="text-3xl font-bold">
          Chat<span className="text-amber-500">App</span>
        </h1>
      </Link>
      <ul className="flex flex-1 gap-2 ml-6">
        {navLinks.map((link, index) => (
          <li key={link.title + index} className="flex flex-col">
            <Link
              href={link.href}
              className={`flex items-center py-3 px-3 rounded-md relative ${
                pathname === link.href ? "" : "hover:bg-neutral-900"
              }`}
            >
              {link.title}
              <div
                className={`absolute left-0 right-0 bottom-[-3px] h-1 bg-indigo-500 rounded-full ${
                  pathname === link.href ? "" : "hidden"
                }`}
              ></div>
            </Link>
          </li>
        ))}
      </ul>
      <UserButton showName />
    </header>
  );
}
