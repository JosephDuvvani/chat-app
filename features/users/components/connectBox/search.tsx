"use client";

import { SearchIcon } from "lucide-react";
import React, { useState } from "react";

export default function ConnectSearch() {
  const [people, setPeople] = useState([]);

  return (
    <form className="flex rounded-full overflow-hidden border-1 border-sky-100">
      <input
        className="flex-1 outline-none bg-sky-50 text-inherit py-2 px-4"
        type="text"
        placeholder="Find people..."
      />
      <button className="text-sky-300 bg-sky-700 py-2 px-3 outline-none focus-visible:bg-sky-900 hover:bg-sky-900 transition-colors cursor-pointer">
        <SearchIcon />
      </button>
    </form>
  );
}
