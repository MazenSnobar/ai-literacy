import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { prisma } from "./services/prisma.server";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

// Fetch all users
export async function loader({ request }: LoaderFunctionArgs) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return json({ users });
}

// Delete user
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _method = formData.get("_method");

  if (_method === "delete") {
    const id = formData.get("id") as string;
    await prisma.user.delete({ where: { id } });
    return redirect("/dashboard/users");
  }

  return null;
}

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-6">👥 All Users</h2>
      {users.length === 0 ? (
        <p className="text-muted-foreground">No users yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="relative group">
              <CardHeader className="flex flex-row items-center gap-4">
                <div>
                  <CardTitle className="text-base">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">Role: {user.role}</p>
              </CardContent>

              <CardFooter className="flex justify-end">
                <fetcher.Form method="post">
                  <input type="hidden" name="_method" value="delete" />
                  <input type="hidden" name="id" value={user.id} />
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </fetcher.Form>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
