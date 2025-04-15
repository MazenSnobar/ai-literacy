// app/session/session.server.ts
import dotenv from "dotenv";
dotenv.config();

import { Organization } from '@prisma/client';
import { createCookieSessionStorage } from '@remix-run/node';

let sessionSecret = process.env.AUTH_KEY?.split(',');
if (!sessionSecret) {
  throw new Error('No session secret provided');
}

export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_auth",
        sameSite: "lax",
        path: "/", 
        httpOnly: true, 
        secrets: sessionSecret,
        secure: process.env.NODE_ENV === "production" 
    },
});
export let { getSession, commitSession, destroySession } = sessionStorage;

export type User = {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  token: string;
  role: "SUPERUSER" | "ADMIN" | "EMPLOYEE";
}

export const storeUserInSession = async (user: Pick<Organization, "id">) => {
const session = await getSession();
session.set("userId", user.id);
const header = await commitSession(session);
return header
};  

export const getUserIdFromSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId")
  return userId;
}


