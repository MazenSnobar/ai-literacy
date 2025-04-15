import { prisma } from "~/services/prisma.server";

export async function getAllOrg() {
    return prisma.organization.findMany({
      orderBy: { createdAt: "desc" }
    });
  };