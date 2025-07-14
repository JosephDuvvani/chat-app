"use client";

import { ArrowBigDown } from "lucide-react";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface ScrollToBottomProps {
  containerRef: RefObject<HTMLDivElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
  isNearBottom: () => boolean;
  notification: number;
  setNotification: Dispatch<SetStateAction<number>>;
}

export default function ScrollToBottom({
  containerRef,
  bottomRef,
  isNearBottom,
  notification,
  setNotification,
}: ScrollToBottomProps) {
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (isNearBottom() && notification > 0) setNotification(0);
      setShowScrollBtn(!isNearBottom());
    };

    container.addEventListener("scroll", onScroll);

    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [notification]);

  return (
    <>
      {showScrollBtn && (
        <>
          {notification > 0 ? (
            <button
              className="flex items-center gap-2 absolute bottom-20 right-6 p-2 bg-green-400 text-green-50 text-sm border-x-3 border-green-600 cursor-pointer hover:bg-green-500 focus:outline-none focus-visible:bg-green-500"
              onClick={() =>
                bottomRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowBigDown size={25} />
              {notification > 1
                ? `${notification} New messages`
                : "New message"}
            </button>
          ) : (
            <button
              className="absolute bottom-20 right-6 p-2 bg-sky-400 text-sky-50 rounded-full cursor-pointer hover:bg-sky-500 focus:outline-none focus-visible:bg-sky-500"
              onClick={() =>
                bottomRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              title="Scroll to bottom"
            >
              <ArrowBigDown size={25} />
            </button>
          )}
        </>
      )}
    </>
  );
}
