"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navList = [
  {
    title: "Chats",
    href: "/chats",
  },
  {
    title: "Connect",
    href: "/connect",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex">
      {navList.map((link, index) => (
        <Link
          href={link.href}
          key={link.title + index}
          className={`flex-1 text-center px-3 py-2 bg-sky-800 relative overflow-hidden outline-none hover:bg-sky-900 focus-visible:bg-sky-700 ${
            pathname.includes(link.href) ? "bg-sky-900" : ""
          }`}
        >
          {link.title}
          <div
            className={`h-1 bg-sky-500 absolute inset-x-0 bottom-0 ${
              pathname.includes(link.href) ? "block" : "bg-sky-900"
            }`}
          ></div>
        </Link>
      ))}
    </nav>
  );
}
