import { prisma } from "./prisma.server";

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
}) {
  return prisma.user.create({ data });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
