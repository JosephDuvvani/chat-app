import React from "react";
import { Person as PersonType } from "../../db/users";
import Image from "next/image";
import Link from "next/link";

export default function Person({ person }: { person: PersonType }) {
  return (
    <div className="flex items-center px-4 py-3">
      <div>
        <Image
          src={person.imageUrl || ""}
          width={40}
          height={40}
          className="rounded-full"
          alt=""
        />
      </div>
      <div className="flex-1 px-2.5">
        <div className="text-neutral-800">{person.name}</div>
      </div>
      <div>
        <Link
          href={`/connect/${person.id}`}
          className="text-green-50 bg-green-600 py-1.5 px-3.5 rounded-full hover:bg-green-900 focus-visible:bg-green-900 transition-colors"
        >
          Chat
        </Link>
      </div>
    </div>
  );
}
