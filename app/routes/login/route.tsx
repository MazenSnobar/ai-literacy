import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "~/session/session.server";
import { authenticateByEmail } from "../services/auth";
import { validate } from "../services/validate";
import { redirectIfLoggedInLoader } from "../services/auth";

export const loader = redirectIfLoggedInLoader;


export const action: ActionFunction = async ({ request }) => {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const errors = validate(email);
    if (Object.keys(errors).length > 0) {
        return json({ errors }, { status: 400 });
      }
    try {
        const updatedSession = await authenticateByEmail(email, session);
        
        return redirect("/verify", {
            headers: {
                "Set-Cookie": await commitSession(updatedSession),
            },
        });
    } catch (error) {
        console.error("Email doesn't exist", error);
        return json({ error: "Email doesn't exist" });
    }
    
};
export default function LoginPage() {
   let actionResult = useActionData<typeof action>();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                Welcome to AI Literacy Platform
            </h1>
            <p className="mt-4 text-lg text-gray-100 text-center">
                Test and Enhance your AI knowledge through structured assessments.
            </p>

            {/* Styled Email Form */}
            <div className="mt-6 max-w-md w-full bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/30">
                <h2 className="text-2xl font-semibold text-white mb-2 text-center">
                    Enter Your Email
                </h2>
        {actionResult?.error && (
          <div className="text-red-500 text-sm text-center mb-2">
            {actionResult.error}
          </div>
        )}
                <Form method="post" className="space-y-4">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        required 
                        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-white focus:outline-none bg-gray-100 text-gray-900 placeholder-gray-500"
                    />
                    <button 
                        type="submit" 
                        className="bg-white text-indigo-600 px-4 py-2 rounded-lg w-full font-semibold hover:bg-indigo-100 transition duration-200"
                    >
                        Submit <Link to="/verify" className="text-indigo-600 hover:underline">here</Link>
                    </button>
                </Form>
                <p className="text-sm text-gray-600 text-center mt-4">
                    Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
