import { Authenticator } from "remix-auth";
import { TOTPStrategy } from "remix-auth-totp";
import {
  redirect,
  Session,
  LoaderFunctionArgs,
  ActionFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";
import { FormStrategy } from "remix-auth-form";
import {
  commitSession,
  destroySession,
  getSession,
  sessionStorage,
} from "../session/session.server";
import { Organization, Prisma, prisma } from "./prisma.server";
import { sendMagicLinkEmail } from "./email.service";
import { createOrganization, findOrgByEmail } from "./organization.server";
import { generateTOTP, verifyTOTP } from "@epic-web/totp";
import { findUserByEmail, getUserFromSession } from "./users.server";


export let authenticator = new Authenticator<string>();
authenticator.use(
  new TOTPStrategy(
    {
      secret: process.env.MAGIC_LINK_SECRET || "",
      emailSentRedirect: "/verify", // When an email is sent
      magicLinkPath: "/verify", // URL the user clicks; must match your route
      successRedirect: "/dashboard", // Where to go on a successful login
      failureRedirect: "/verify", // Where to go on failure
      sendTOTP: async ({ email, code, magicLink }) => {
        // Use your email service here to send the TOTP code and magic link.
        await sendMagicLinkEmail(email, code, magicLink);
        console.log("TOTP sent:", { email, code, magicLink });
      },
    },
    async ({ email, request }) => {
      // Look up the user in the database.
      const user = await findUserByEmail(email);
      if (!user) throw new Error("User not found");

      // Return the user’s ID, which is stored in the session.
      const session = await getSession(request.headers.get("Cookie"));
      session.set("userId", user.id);

      const sessionCookie = await commitSession(session);

      throw redirect("/dashboard", {
        headers: {
          "Set-Cookie": sessionCookie,
        },
      });
    }
  ),
  "TOTP"
);

type VerifyResult =
  | { success: true; session: Session }
  | { success: false; error: string };

// Register an organization during signup
export async function registerOrganizationByEmail(email: string, name:string) {
  try {
    const organization = await createOrganization({ name, email });
    return organization
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Registration failed."
    );
  }
}

export async function getAuthFromRequest(
  request: Request
): Promise<string | null> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("organizationId") ?? null;
}
export type AuthenticatedUser = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export interface AuthenticatedLoaderArgs extends LoaderFunctionArgs {
  context: {
    user: AuthenticatedUser;
  };
}

interface AuthenticatedActionArgs extends ActionFunctionArgs {
  context: {
    user: AuthenticatedUser;
  };
}
export const userInclude: Prisma.UserInclude = {
  UserRole: {
    include: {
      role: true,
    },
  },
  Organization: true,
};

export function withAuth(
  loader: (args: AuthenticatedLoaderArgs) => ReturnType<LoaderFunction>
) {
  return async (args: LoaderFunctionArgs) => {
    const user = await getUserFromSession(args.request);

    if (!user) {
      const session = await getSession(args.request.headers.get("Cookie"));

      throw redirect("/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }

    return loader({
      ...args,
      context: {
        user,
      },
    });
  };
}
