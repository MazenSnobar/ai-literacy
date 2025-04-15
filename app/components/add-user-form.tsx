import { Form, useFetcher } from "@remix-run/react";
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
import { useEffect } from "react";

export const ADD_USER_INTENT = "add_user";
export const DELETE_USER_INTENT = "delete-user";
export const CHANGE_USER_ROLE_INTENT = "change-role";

type Props = {
  roles: Array<{ id: string; name: string }>;
  onSuccess: () => void;
};

export const AddUserForm = ({ roles, onSuccess }: Props)  => {
  const fetcher = useFetcher<{ success?: boolean; message?: string }>();

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data?.success
    ) {
      onSuccess(); 
    }
  }, [fetcher.state, fetcher.data, onSuccess]);
  return (
    <div className="p-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
          <CardDescription>
            Fill out the form below to add a new team member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post" className="space-y-6">
            <input type="hidden" name="intent" value={ADD_USER_INTENT} />
            {fetcher.data?.message && (
              <p className="text-red-600 text-sm">{fetcher.data.message}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                name="name"
                id="name"
                type="text"
                required
                placeholder="name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                name="email"
                id="email"
                type="email"
                required
                placeholder="email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                name="role"
                id="role"
                required
                className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  -- Select a role --
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full">
              Add User
            </Button>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
};
