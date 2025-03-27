import { Authenticator } from "remix-auth";
import { createCookie, redirect, Session,  LoaderFunctionArgs, json, } from "@remix-run/node";
import { commitSession, getSession, sessionStorage } from "../../session/session.server";
import { Organization, prisma } from "./prisma.server";
import { sendVerificationCode } from "./email.service";
import { createOrg } from "./organization.server";

export let authenticator = new Authenticator<Organization>(sessionStorage);

type VerifyResult =
  | { success: true; session: Session }
  | { success: false; error: string };

// Register an organization during signup
export async function registerOrganizationByEmail(email: string) {
  try {
    const organization = await createOrg({ email });
    return organization.id;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Registration failed.");
  }
}

// Orginization Employee log-in
export async function authenticateByEmail(email: string, session: Session) {
  const organization = await prisma.organization.findUnique({ where: { email } });
  if (!organization) throw new Error("Already exists");
  const token = process.env.AUTH_KEY;
  if (!token) throw new Error("Missing auth token.");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await sendVerificationCode(email, code);

  session.set("email", email);
  session.set("token", token);
  session.set("verificationCode", code);
  session.set("organizationId", organization.id);

  return session;
}

export async function verifyEmailCode(request: Request): Promise<VerifyResult> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const formData = await request.formData();
  const code = formData.get("code");

  const storedCode = session.get("verificationCode");
  const storedEmail = session.get("email");

  if (!storedCode || !storedEmail) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  if (storedCode !== code) {
    return { success: false, error: "Invalid verification code." };
  }
  session.unset("verificationCode");

  return { success: true, session };
}
export async function getAuthFromRequest(request: Request): Promise<string | null> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("organizationId") ?? null;
}
export async function redirectIfLoggedInLoader({ request }: LoaderFunctionArgs) {
  let organizationId = await getAuthFromRequest(request);
  if (organizationId) {
    throw redirect("/dashboard");
  }
  return null;
}
export async function redirectIfNotLoggedInLoader({ request }: LoaderFunctionArgs) {
  const organizationId = await getAuthFromRequest(request);
  if (!organizationId) {
    throw redirect("/login");
  }
  return null; 
}



