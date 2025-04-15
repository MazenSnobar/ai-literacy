import { prisma } from "./prisma.server";

export async function createOrganization(data: {
  name: string;
  email: string;
}) {
    const existOrg = await prisma.organization.findUnique ({
      where: {email: data.email}
    });
    if (existOrg) {
    throw new Error("Organization already exist!")
    }
  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });
  return true;
}

export const deleteOrg = async (id: string) => {
  return await prisma.organization.delete({
    where: { id },
  });
};

export async function toggleOrgActive(id: string, current: boolean) {
  return await prisma.organization.update({
    where: { id },
    data: { isActive: current },
  });
}

export async function findOrgByEmail(email: string) {
  return await prisma.organization.findUnique({
    where: { email },
  });
}
export async function findOrgById(id: string) {
  return await prisma.organization.findUnique({
    where: { id },
  });
}
