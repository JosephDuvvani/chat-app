import { prisma } from "@/lib/prisma";

type User = {
  name: string;
  imageUrl?: string;
  email: string;
  clerkId: string;
};

export async function createUser(user: User) {
  const newUser = await prisma.user.create({
    data: user,
  });

  return newUser;
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
