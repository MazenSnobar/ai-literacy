import { Form, useActionData, useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "../../services/auth";
import { commitSession, getSession } from "~/session/session.server";
import { Cookie } from "@mjackson/headers";

interface ActionData {
  error?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  console.log("userId", userId);
  if (userId) {
    return redirect("/dashboard");
  }
  const cookie = new Cookie(request.headers.get("Cookie") || "");
  const totpCookie = cookie.get("_totp");

  const url = new URL(request.url);
  const token = url.searchParams.get("t");

  if (token) {
    try {
      return await authenticator.authenticate("TOTP", request);
    } catch (error) {
      if (error instanceof Response) return error;
      if (error instanceof Error) return { error: error.message };
      return { error: "Invalid TOTP" };
    }
  }
  let email = null;

  if (totpCookie) {
    const params = new URLSearchParams(totpCookie);
    email = params.get("email");
  }
  if (!email) return redirect("/login");

  return { email };
}

export const action: ActionFunction = async ({ request }) => {
  try {
    // Authenticate the user via TOTP (Form submission).
    return await authenticator.authenticate("TOTP", request);
  } catch (error) {
    if (error instanceof Response) {
      const cookie = new Cookie(error.headers.get("Set-Cookie") || "");
      const totpCookie = cookie.get("_totp");
      if (totpCookie) {
        const params = new URLSearchParams(totpCookie);
        return { error: params.get("error") };
      }

      throw error;
    }
    return { error: "Invalid TOTP" };
  }
};
export default function VerifyCode() {
  const actionData = useActionData<ActionData>();
  const loaderData = useLoaderData<typeof loader>()
  const navigation = useNavigation();
  const fetcher = useFetcher<{ error?: string }>()
  const isSubmitting = fetcher.state !== 'idle' || fetcher.formData != null

  const code = 'code' in loaderData ? loaderData.code : undefined
  const email = 'email' in loaderData ? loaderData.email : undefined
  const error = 'error' in loaderData ? loaderData.error : null
  const errors = fetcher.data?.error || error


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Enter Code</h1>
        <p className="text-gray-600 text-sm text-center mb-4">
          A verification code was sent to your email. Enter it below.
        </p>
        <Form method="POST" className="flex flex-col">
          <input
            type="text"
            name="code"
            placeholder="Enter Verification Code"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className={`bg-green-600 text-white p-3 mt-4 rounded-lg hover:bg-green-700 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </button>
        </Form>
        {actionData?.error && (
          <p className="text-red-500 text-center mt-2">{actionData.error}</p>
        )}
      </div>
    </div>
  );
}
