import { getSession } from "~/session/session.server";
import { prisma } from "./prisma.server";
import { AuthenticatedUser, userInclude } from "./auth";

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { UserRole: { include: { role: { select: { name: true } } } } }, where: {
      UserRole: {
        some: {
          role: {
            name: {
              not: "EMPLOYEE", // Excludes employees from Superuser dashboard.
            },
          },
        },
      },
    },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  roleId: string;
}) {
  const existUser = await prisma.user.findUnique ({
    where: {email: data.email}
  });
  if (existUser) {
  throw new Error("User already exist!")
  }
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: data.roleId,
    },
  });

  return true;
}
export async function changeRole({
  userId,
  roleId,
}: {
  userId: string;
  roleId: string;
}) {
  await prisma.userRole.updateMany({
    where: { userId },
    data: { roleId },
  });
  return true;
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserFromSession(
  request: Request
): Promise<AuthenticatedUser | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) return null;

  return prisma.user.findFirst({
    where: { id: userId },
    include: userInclude,
  });
}
