import { prisma } from "@/lib/prisma";

type Message = {
  chatId: string;
  senderId: string;
  content: string;
};

export async function createMessage(message: Message) {
  const newMessage = await prisma.message.create({
    data: message,
  });

  return newMessage;
}

export async function getMessageByChatId(
  chatId: string,
  limit: number,
  offset: number
) {
  const message = await prisma.message.findMany({
    where: { chatId },
    take: limit,
    skip: offset,
  });

  return message;
}

export async function updateMessage(id: string, content: string) {
  const updatedMessage = await prisma.message.update({
    where: { id },
    data: {
      content,
    },
  });

  return updatedMessage;
}

export async function deleteMessage(id: string) {
  const deletedMessage = await prisma.message.delete({
    where: { id },
  });

  return deletedMessage;
}
