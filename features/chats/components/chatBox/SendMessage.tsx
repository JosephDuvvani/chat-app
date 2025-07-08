"use client";

import { SendIcon } from "lucide-react";
import React, { useState } from "react";

export default function SendMessage({ receiverId }: { receiverId: string }) {
  const [message, setMessage] = useState("");

  return (
    <form className="flex">
      <input
        className="flex-1 outline-none bg-sky-900 text-sky-50 py-2 px-4 rounded-full mr-2"
        type="text"
        placeholder="Send Message..."
      />
      <button className="text-sky-500 p-2 rounded-full outline-none focus-visible:bg-sky-200 hover:bg-sky-200 transition-colors cursor-pointer">
        <SendIcon />
      </button>
    </form>
  );
}
