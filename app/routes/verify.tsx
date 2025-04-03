import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { verifyEmailCode } from "./services/auth";
import { commitSession } from "~/session/session.server";


interface ActionData {
    error?: string;
}

export const action: ActionFunction = async ({ request }) => {
//     try {
//       const response = await verifyEmailCode(request);
//   if (response.success)
      return redirect("/dashboard"); {
//         headers: {
//           "Set-Cookie": await commitSession(response.session),
//         },
//       });
//     } catch (error: any) {
//       console.error("Verification failed:", error.message);
//       return json({ error: error.message }, { status: 400 });
    }
   };
export default function VerifyCode() {
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-semibold text-center mb-6">Enter Code</h1>
                <p className="text-gray-600 text-sm text-center mb-4">
                    A verificatioÍn code was sent to your email. Enter it below.
                </p>
                <Form method="post" className="flex flex-col">
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
