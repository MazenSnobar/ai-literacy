// components/LoginForm.tsx
import { Form, Link } from "@remix-run/react";

export function LoginForm({ error }: { error?: string }) {
  return (
    <Form method="post" className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm text-center mb-2">{error}</div>
      )}
      <input 
        type="email" 
        name="email" 
        placeholder="Enter your email" 
        required 
        className="..."
      />
      <button type="submit" className="...">
        Submit
      </button>
    </Form>
  );
}
