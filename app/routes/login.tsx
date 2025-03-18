import {ActionFunction, json, redirect} from "@remix-run/node";
import {Form, Link} from "@remix-run/react";
import {commitSession, getSession} from "~/entry.server";
import {sendVerificationCode} from "~/email.service";

export const action: ActionFunction = async ({ request }) => {
    const session = await getSession(request);
    const formData = await request.formData();
    const email = formData.get("email") as string;

    if (!email) {
        return json({ error: "Email is required." }, { status: 400 });
    }
    if (session?.get("email")) {
        return redirect("/verify");
    }

    // Generate a random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        await sendVerificationCode(email, code);

        // Store the email & code in session
        const session = await getSession(request);
        session.set("email", email);
        session.set("verificationCode", code); // Store the code (temporary)

        return redirect("/auth/verify", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
        return json({ error: "Failed to send email. Try again." }, { status: 500 });
    }
};


export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
                <p className="text-gray-600 text-sm text-center mb-4">
                    Enter your email to receive a verification code.
                </p>
                <Form method="post" action="/api/send-code" className="flex flex-col">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-3 mt-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Send Code
                    </button>
                </Form>
                <p className="text-sm text-gray-600 text-center mt-4">
                    Dont have an account? <Link to="/app/routes/signup" className="text-blue-600 hover:underline">Sign
                    up</Link>
                </p>
            </div>
        </div>
    );
}
