import type { MetaFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { Form, Link, redirect } from "@remix-run/react";
import { authenticator } from "./services/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-gray p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <p className="text-gray-600 text-sm text-center mb-4">
          Enter your email to receive a verification code.
        </p>
        <Form method="post" className="flex flex-col">
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
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
