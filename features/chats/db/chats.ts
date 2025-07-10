import { Person } from "@/features/users/db/users";
import { prisma } from "@/lib/prisma";

export type Chat = {
  id: string;
  users: Omit<Person, "email">[];
  messages: { content: string }[];
  createdAt: Date;
};

export async function createChat(userA_Id: string, userB_Id: string) {
  const newChat = await prisma.chat.create({
    data: {
      users: {
        create: [
          { user: { connect: { id: userA_Id } } },
          { user: { connect: { id: userB_Id } } },
        ],
      },
    },
  });

  return newChat;
}

export async function chatExists(userA_Id: string, userB_Id: string) {
  const chat = await prisma.chat.findFirst({
    where: {
      users: {
        every: {
          userId: { in: [userA_Id, userB_Id] },
        },
      },
    },
  });

  return !!chat;
}

export async function getChatIdByUsers(userA_Id: string, userB_Id: string) {
  const chat = await prisma.chat.findFirst({
    where: {
      users: {
        every: {
          userId: { in: [userA_Id, userB_Id] },
        },
      },
    },
    select: {
      id: true,
    },
  });

  return chat?.id;
}

const limit = 20;
export async function getChats(
  userId: string,
  offset: number
): Promise<Chat[]> {
  const data = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
    include: {
      users: {
        where: {
          NOT: {
            userId,
          },
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
      messages: {
        select: {
          content: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  const chats = data.map((chat) => ({
    ...chat,
    users: chat.users.map((data) => data.user),
  }));

  return chats;
}

export async function deleteChat(id: string) {
  const deletedChat = await prisma.chat.delete({
    where: {
      id,
    },
  });

  return deletedChat;
}
