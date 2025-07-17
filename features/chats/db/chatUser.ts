import { prisma } from "@/lib/prisma";

export async function updateLastSeenAt(userId: string, chatId: string) {
  const updatedChatUser = await prisma.chatUser.update({
    where: {
      userId_chatId: {
        userId,
        chatId,
      },
    },
    data: {
      lastSeenAt: new Date(),
    },
  });
  return updatedChatUser;
}
