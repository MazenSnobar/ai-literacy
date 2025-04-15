import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  useLoaderData,
  useFetcher,
  Link,
  useOutletContext,
} from "@remix-run/react";
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
import { getAllOrg } from "./queries";
import { Switch } from "~/components/ui/switch";
import { Organization } from "~/services/prisma.server";
import { useState } from "react";
import {
  ADD_ORG_INTENT,
  AddOrganisationForm,
  DELETE_ORG_INTENT,
  SELECT_ORG_INTENT,
  TOGGLE_ORG_INTENT,
  UNSELECT_ORG_INTENT,
} from "~/components/add-organization-form";
import {
  createOrganization,
  deleteOrg,
  toggleOrgActive,
} from "~/services/organization.server";
import { Check } from "lucide-react";
import { commitSession, getSession } from "~/session/session.server";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const id = formData.get("id") as string;

  if (intent === ADD_ORG_INTENT) {
    try {
      await createOrganization({ name, email });
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
  if (intent === DELETE_ORG_INTENT) {
    await deleteOrg(id);
    return Response.json({
      success: true,
      message: `User Deleted`,
    });
  }
  if (intent === TOGGLE_ORG_INTENT) {
    const current = formData.get("isActive") === "true";
    await toggleOrgActive(id, current);
    return Response.json({ success: true });
  }

  if (intent === SELECT_ORG_INTENT) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("selectedOrgId", id);
    return Response.json(
      { success: true },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
  if (intent === UNSELECT_ORG_INTENT) {
    const session = await getSession(request.headers.get("Cookie"));
    session.unset("selectedOrgId");
  
    return Response.json(
      { success: true },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        }
      }
    );
  }
  
}
export async function loader({ request }: LoaderFunctionArgs) {
  const organizations = await getAllOrg();
  const session = await getSession(request.headers.get("Cookie"));
  const selectedOrgId = session.get("selectedOrgId");
  console.log("[Loader] Selected Org from session:", selectedOrgId);
  return Response.json({ organizations, selectedOrgId });
}

export default function () {
  const [formShowing, setFormShowing] = useState(false);
  const { organizations } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { selectedOrgId, setSelectedOrgId } = useOutletContext<{
    selectedOrgId: string | null;
    setSelectedOrgId: (id : string) => void;
  }>();
  return (
    <section>
      <div>
      <h1 className="text-2xl font-bold mb-6">Manage Organizations</h1>
        <section className="flex justify-end gap-4 p-10">
          <Button onClick={() => setFormShowing((prev) => !prev)}>
            Add organisation
          </Button>
        </section>
        {formShowing && (
          <AddOrganisationForm onSuccess={() => setFormShowing(false)} />
        )}
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {organizations.map((organization: Organization, index: number) => {
          const isActive =
            fetcher.state !== "idle" &&
            fetcher.formData?.get("intent") === TOGGLE_ORG_INTENT &&
            organization.id === fetcher.formData.get("id")
              ? fetcher.formData.get("isActive") === "true"
              : organization.isActive;

          return (
            <Card
              key={organization.id}
              className="w-full max-w-sm mx-auto bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-center"
            >
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl text-gray-800 font-semibold">
                  {organization.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {organization.email}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mt-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <span>Status:</span>
                      <Badge
                        className="text-xs"
                        variant="outline"
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => {
                        fetcher.submit(
                          {
                            intent: TOGGLE_ORG_INTENT,
                            id: organization.id,
                            isActive: checked,
                          },
                          { method: "post" }
                        );
                      }}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <fetcher.Form method="post">
                  <input
                    type="hidden"
                    name="intent"
                    value={
                      selectedOrgId === organization.id
                        ? SELECT_ORG_INTENT
                        : UNSELECT_ORG_INTENT
                }
                  />
                  <input type="hidden" name="id" value={organization.id} />
                  <Button
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 mr-2"
                    onClick={() => setSelectedOrgId(selectedOrgId === organization.id ? "" : organization.id)}
                    variant={"outline"}
                    size="sm"
                  >
                    {selectedOrgId === organization.id ? (
                      <>
                        <Check className="w-4 h-4 mr-1" /> Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </fetcher.Form>
                <fetcher.Form method="post">
                  <input
                    type="hidden"
                    name="intent"
                    value={DELETE_ORG_INTENT}
                  />
                  <input type="hidden" name="id" value={organization.id} />
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
          );
        })}
      </section>
    </section>
  );
}
