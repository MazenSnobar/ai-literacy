import { Form, json, redirect, useActionData } from "@remix-run/react";
import { registerOrganizationByEmail } from "../services/auth";
import { ActionFunction} from "@remix-run/node";
import { validate } from "../services/validate";
import { redirectIfLoggedInLoader } from "../services/auth";

export const loader = redirectIfLoggedInLoader;

export const action: ActionFunction = async ({ request }) => {
      const formData = await request.formData();
      const email = formData.get("email") as string;
      const errors = await validate(email);
  if (Object.keys(errors).length > 0)
     {
    return json({ errors }, { status: 400 });
    }
try {
     await registerOrganizationByEmail(email);
    
      return redirect("/login", {
      });
    } catch (error: any) {
        return json({ error: error.message }, { status: 400 });
      }
    };
export default function SignupPage() {
    let actionResult = useActionData<typeof action>();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
          <h1 className="text-2xl font-semibold">Sign Up</h1>

          <Form method="post" className="space-y-4 w-full max-w-md bg-white p-6 rounded shadow-md">
              {actionResult?.success && (
                  <div className="text-green-600 text-sm mb-2 text-center font-semibold">
                      {actionResult.success}
                  </div>
              )}
            {actionResult?.errors?.email && (
                <div className="text-red-500 text-sm mb-2 text-center">
                    {actionResult.errors.email}
                </div>
            )}

            {actionResult?.error && (
                <div className="text-red-500 text-sm mb-2 text-center">
                    {actionResult.error}
                </div>
            )}


                {actionResult?.error && (
                <div className="text-red-500 text-sm mb-2 text-center">
                {actionResult.error}
                </div>
                )}


              <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className={`border p-2 rounded w-full ${actionResult?.error ? "border-red-500" : "border-gray-300"}`}
              />
              
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                  Sign Up
              </button>
          </Form>
      </div>
  );
}