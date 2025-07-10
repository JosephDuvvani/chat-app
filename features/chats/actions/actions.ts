"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createChat, getChatIdByUsers } from "../db/chats";
import { auth } from "@clerk/nextjs/server";
import { createMessage } from "../db/messages";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "@/features/users/db/users";

const FormSchema = z.object({
  message: z.string().min(1, { message: "Please write a message." }),
});

export type State = {
  errors?: {
    message?: string[];
  };
  message?: string | null;
};

export async function sendConnectMessage(
  receiverId: string,
  prevState: State,
  formData: FormData
) {
  const validateFields = FormSchema.safeParse({
    message: formData.get("message"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Cannot send an empty message.",
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const authUser = await getUserByClerkId(userId);
  let chatId = await getChatIdByUsers(authUser!.id, receiverId);

  if (!chatId) {
    const chat = await createChat(authUser!.id, receiverId);
    chatId = chat.id;
  }

  const { message } = validateFields.data;

  await createMessage({ chatId, senderId: authUser!.id, content: message });

  revalidatePath(`/chats/${chatId}`);
  redirect(`/chats/${chatId}`);
}
