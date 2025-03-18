import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/entry.server";

interface ActionData {
    error?: string;
}

export const action = async ({ request }) => {
    const session = await getSession(request);
    const formData = await request.formData();
    const code = formData.get("code");

    const storedCode = session.get("verificationCode");
    const storedEmail = session.get("email");

    if (!storedCode || !storedEmail) {
        return redirect("/login"); // Redirect if session is missing
    }

    if (!code) {
        return json({ error: "Code is required" }, { status: 400 });
    }

    if (storedCode !== code) {
        return json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Mark user as authenticated
    session.set("isAuthenticated", true);

    // Clear verification code after successful login
    session.unset("verificationCode");

    return redirect("/dashboard", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
};

export default function VerifyCode() {
    const actionData = useActionData<ActionData>(); // ✅ Define type here
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-semibold text-center mb-6">Enter Code</h1>
                <p className="text-gray-600 text-sm text-center mb-4">
                    A verification code was sent to your email. Enter it below.
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
