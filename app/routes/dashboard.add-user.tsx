import { Form } from "@remix-run/react";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { createUser } from "./services/users.server";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "ADMIN" | "EMPLOYEE";

  await createUser({ name, email, role });
  return redirect("/dashboard/users");
}

export default function AddUserPage() {
  return (
    <div className="p-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
          <CardDescription>Fill out the form below to add a new team member.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input name="name" id="name" type="text" required placeholder="John Doe" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input name="email" id="email" type="email" required placeholder="john@example.com" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                name="role"
                id="role"
                className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              ➕ Add User
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
