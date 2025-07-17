import { Person } from "@/features/users/db/users";
import { prisma } from "@/lib/prisma";

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Chat = {
  id: string;
  users: { user: Omit<Person, "email">; lastSeenAt: Date | null }[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export type FullChat = {
  id: string;
  users: Omit<Person, "email">[];
  messages: Message[];
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

  return chat ? { chatId: chat.id } : null;
}

export async function isChatUser(userId: string, chatId: string) {
  const chat = await prisma.chat.findFirst({
    where: {
      AND: [{ id: chatId }, { users: { some: { userId } } }],
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
export async function getChatListByClerkId(
  clerkId: string,
  offset: number
): Promise<Chat[]> {
  const data = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          user: {
            clerkId,
          },
        },
      },
    },
    include: {
      users: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          lastSeenAt: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  return data;
}

export async function getChat(id: string): Promise<FullChat | null> {
  const chat = await prisma.chat.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              clerkId: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!chat) return null;

  const fullChat = {
    ...chat,
    users: chat.users.map((data) => data.user),
  };

  return fullChat;
}

export async function deleteChat(id: string) {
  const deletedChat = await prisma.chat.delete({
    where: {
      id,
    },
  });

  return deletedChat;
}
