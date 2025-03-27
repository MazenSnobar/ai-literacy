
import { prisma } from "./prisma.server";

export const createOrg = async (organization: { email: string; name?: string }) => {
    const existingOrg = await prisma.organization.findUnique({
        where: { email: organization.email },
    });

    if (existingOrg) {
        throw new Error("This email is already registered. Please use another one.");
    }
    

    const newOrg = await prisma.organization.create({
        data: {
            email: organization.email,
            name: organization.name || `User-${Date.now()}`, // Assign a default name if none is provided
        },
    });

    return { id: newOrg.id, email: newOrg.email, name: newOrg.name };
};
