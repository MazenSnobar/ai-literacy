import { Outlet, useLoaderData } from "@remix-run/react";

import { Separator } from "~/components/ui/separator";

import { authenticator, withAuth } from "~/services/auth";
import { getSession } from "~/session/session.server";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { useState } from "react";
import { findOrgById } from "~/services/organization.server";

// export const loader = redirectIfNotLoggedInLoader;

// Fetch all users
export const loader = withAuth(async ({ request, context: { user } }) => {
  // @ts-ignore role is there but prisma cannot type pivot tables well
  const role = user.UserRole.at(0)?.role?.name;
  const url = new URL(request.url);
  const session = await getSession(request.headers.get("Cookie"));
  const selectedOrgId = session.get("selectedOrgId");

  let selectedOrg = null;
  if (selectedOrgId) {
    selectedOrg = await findOrgById(selectedOrgId);
  }
  // if (
  //   role === UserRoleOption.SUPERUSER &&
  //   !url.pathname.startsWith("/dashboard/superuser")
  // ) {
  //   return redirect("/dashboard/superuser");
  // } else if (
  //   role === UserRoleOption.ADMIN &&
  //   !url.pathname.startsWith("/dashboard/admin")
  // ) {
  //   return redirect("/dashboard/admin");
  // }

  return Response.json({ selectedOrg });
});

export default function RouteComponent() {
  const { selectedOrg } = useLoaderData<typeof loader>();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(
    selectedOrg?.id || null
  );
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar selectedOrg={selectedOrg} />
        <SidebarTrigger />
        <main className="flex-1 p-6 bg-background">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          </div>

          <Separator className="my-4" />

          {/* Nested route content */}
          <Outlet
            context={{ selectedOrgId, setSelectedOrgId }}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
