import { Message } from "@/features/chats/db/chats";
import { Person } from "@/features/users/db/users";
import MessageBox from "./MessageBox";

interface ChatMessagesProps {
  messages: Message[];
  users: {
    me: Omit<Person, "email">;
    receiver: Omit<Person, "email">;
  };
}

export default function ChatBoxMessages({
  messages,
  users,
}: ChatMessagesProps) {
  const { me, receiver } = users;

  return (
    <div className="flex flex-col pt-10 pb-5">
      {messages.length > 0 &&
        messages.map((msg) => (
          <div key={msg.id}>
            <MessageBox
              message={msg}
              isSender={msg.senderId === me.id}
              sender={msg.senderId === me.id ? me : receiver}
            />
          </div>
        ))}
    </div>
  );
}
