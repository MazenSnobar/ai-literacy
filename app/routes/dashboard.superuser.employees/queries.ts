import { redirect } from "@remix-run/react";
import { prisma } from "~/services/prisma.server";

export async function getOrgEmployees(selectedOrgId: string) {
  return prisma.user.findMany({
    where: { organizationId: selectedOrgId },
    orderBy: { createdAt: "desc" },
    include: {
      UserRole: {
        include: { role: { select: { name: true } } },
      },
    },
  });
}