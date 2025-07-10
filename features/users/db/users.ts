import { prisma } from "@/lib/prisma";

type User = {
  name: string | null;
  imageUrl?: string | null;
  email: string;
  clerkId: string;
};

export type Person = {
  id: string;
  name: string | null;
  imageUrl: string | null;
  email: string;
  clerkId?: string;
};

export async function createUser(user: User) {
  const newUser = await prisma.user.create({
    data: user,
  });

  return newUser;
}

export async function getUserByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  return user;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
}

export async function updateUser(
  id: string,
  user: Omit<Partial<User>, "clerkId">
) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: user,
  });

  return updatedUser;
}

export async function deleteUser(id: string) {
  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  return deletedUser;
}

const limit = 20;

export async function fetchPeople(clerkId: string) {
  try {
    const people: Person[] = await prisma.user.findMany({
      where: {
        NOT: { clerkId },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        email: true,
      },
      take: limit,
    });
    return people;
  } catch (err) {
    console.error("Database Error", err);
    throw new Error("Failed to fetch people");
  }
}
