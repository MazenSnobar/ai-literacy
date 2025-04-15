import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import {
  changeRole,
  createUser,
  deleteUser,
  getAllUsers,
} from "~/services/users.server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";
import {
  ADD_USER_INTENT,
  AddUserForm,
  CHANGE_USER_ROLE_INTENT,
  DELETE_USER_INTENT,
} from "~/components/add-user-form";
import { prisma, User } from "~/services/prisma.server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Fetch all users
export async function loader({ request }: LoaderFunctionArgs) {
  const users = await getAllUsers();
  const roles = await prisma.role.findMany({
    select: { id: true, name: true },
  });

  return Response.json({ users, roles });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const id = formData.get("id") as string;

  if (intent === ADD_USER_INTENT) {
    const roleId = String(formData.get("role"));

    try {
      await createUser({ name, email, roleId });
      return Response.json({
        success: true,
        message: `User succesfully added`,
      });
    } catch (e) {
      console.error(e);
      return Response.json({
        success: false,
        message: (e as Error).message || `Could not add the new user`,
      });
    }
  }
  if (intent === DELETE_USER_INTENT) {
    await deleteUser(id);
    return Response.json({
      success: true,
      message: `User Deleted`,
    });
  }
  if (intent === CHANGE_USER_ROLE_INTENT) {
    const roleId = String(formData.get("role"));
    await changeRole({ userId: id, roleId });
    return Response.json({
      success: true,
      message: `Role Changed`,
    });
  }
}
export default function () {
  const [formShowing, setFormShowing] = useState(false);
  const { users, roles } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  return (
    <section>
      <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
        <section className="flex justify-end gap-4 p-10">
          <Button onClick={() => setFormShowing(prev => !prev)}>Add User</Button>
        </section>
        {formShowing && <AddUserForm roles={roles} onSuccess={() => setFormShowing(false)} />}
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {users.map((user: any) => (
          <Card
            key={user.id}
            className="w-full max-w-sm mx-auto bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-center"
          >
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-gray-800 font-semibold">
                {user.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 ">
                {user.email}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mt-1">
                <span className="text-sm font-medium text-gray-600">Role:</span>{" "}
                <Badge className="text-xs" variant="outline">
                  {user.UserRole.map(
                    (usrRolePivot: { role: { name: string } }) =>
                      usrRolePivot.role.name
                  ).join()}
                </Badge>
              </div>
              <fetcher.Form method="post" id={`role-form-${user.id}`}>
                <input
                  type="hidden"
                  name="intent"
                  value={CHANGE_USER_ROLE_INTENT}
                />
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="role" id={`role-input-${user.id}`} />

                <Select
                  defaultValue={user.UserRole[0]?.role?.id}
                  onValueChange={(value) => {
                    const input = document.getElementById(
                      `role-input-${user.id}`
                    ) as HTMLInputElement;
                    input.value = value;

                    const form = document.getElementById(
                      `role-form-${user.id}`
                    ) as HTMLFormElement;
                    form.requestSubmit();
                  }}
                >
                  <SelectTrigger className="w-full mt-4 text-s border border-gray-300">
                    <SelectValue placeholder="Change Role" />
                  </SelectTrigger>
                  <SelectContent className = "backdrop-blur-md ">
                    {roles.filter((role: any) => role.name !== "EMPLOYEE").map((role: any) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </fetcher.Form>
            </CardContent>

            <CardFooter className="flex justify-end">
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value={DELETE_USER_INTENT} />
                <input type="hidden" name="id" value={user.id} />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
              </fetcher.Form>
            </CardFooter>
          </Card>
        ))}
      </section>
    </section>
  );
}
