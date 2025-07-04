import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId } = await auth();

  return {
    userId,
    user: allData && userId != null ? await getUser(userId) : undefined,
  };
}

async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: {
      clerkId: id,
    },
  });
}
