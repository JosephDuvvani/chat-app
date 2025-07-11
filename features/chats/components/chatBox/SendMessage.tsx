"use client";

import { SendIcon } from "lucide-react";
import { sendMessage, State } from "@/features/chats/actions/actions";
import { useActionState } from "react";

export default function SendMessage({ chatId }: { chatId: string }) {
  const initialState: State = { message: null, errors: {} };
  const sendMessageWithChatId = sendMessage.bind(null, chatId);
  const [state, formAction] = useActionState(
    sendMessageWithChatId,
    initialState
  );

  return (
    <>
      <div>
        {state.errors?.message && (
          <span className="text-rose-600">{state.errors.message[0]}</span>
        )}
      </div>
      <form action={formAction} className="flex">
        <input
          className="flex-1 outline-none bg-sky-900 text-sky-50 py-2 px-4 rounded-full mr-2"
          type="text"
          name="message"
          placeholder="Send Message..."
          autoComplete="off"
        />
        <button
          type="submit"
          className="text-sky-500 p-2 rounded-full outline-none focus-visible:bg-sky-200 hover:bg-sky-200 transition-colors cursor-pointer"
        >
          <SendIcon />
        </button>
      </form>
    </>
  );
}
