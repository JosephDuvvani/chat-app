"use client";

import { sendConnectMessage, State } from "@/features/chats/actions/actions";
import { useActionState } from "react";

export default function ConnectForm({ receiverId }: { receiverId: string }) {
  const initialState: State = { message: null, errors: {} };
  const sendMessageWithId = sendConnectMessage.bind(null, receiverId);
  const [state, formAction] = useActionState(sendMessageWithId, initialState);

  return (
    <form action={formAction} className="flex flex-col max-w-2xl mx-auto">
      <input
        type="text"
        name="message"
        placeholder="Write message..."
        className="p-3 mt-4 bg-amber-50 border-1 border-amber-100 rounded-md outline-none focus:border-amber-200"
        autoComplete="off"
        autoFocus
      />
      <div>
        {state.errors?.message && (
          <span className="text-rose-600">{state.errors.message[0]}</span>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-rose-800 text-red-50 px-4 py-1.5 my-4 rounded-lg cursor-pointer outline-none hover:bg-rose-900 focus-visible:bg-rose-900 transition-colors"
        >
          Send
        </button>
      </div>
    </form>
  );
}
