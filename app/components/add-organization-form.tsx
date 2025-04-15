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

export const ADD_ORG_INTENT = "add_organization";
export const DELETE_ORG_INTENT = "delete-organization";
export const TOGGLE_ORG_INTENT = "toggle-organization";
export const SELECT_ORG_INTENT = "select-organization";
export const UNSELECT_ORG_INTENT = "unselect-organization";


export const AddOrganisationForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const fetcher = useFetcher<{ success?: boolean; message?: string }>();

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data?.success
    ) {
      onSuccess(); 
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

 

    return <div className="p-10">
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Organization</CardTitle>
        <CardDescription>
          Fill out the form below to register a new organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <fetcher.Form method="post" className="space-y-6">
            <input type="hidden" name="intent" value={ADD_ORG_INTENT} />
            {fetcher.data?.message && (
              <p className="text-red-600 text-sm">{fetcher.data.message}</p>
            )}
          <div className="grid gap-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              name="name"
              id="name"
              type="text"
              required
              placeholder="Enter Organization Name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Organization Email</Label>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="Enter org email"
            />
          </div>

          <Button type="submit" className="w-full">
            ➕ Add Organization
          </Button>
        </fetcher.Form>
      </CardContent>
    </Card>
  </div>
}