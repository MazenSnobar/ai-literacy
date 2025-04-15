import { UserRoleOption } from "@prisma/client";
import { Organization } from "~/services/prisma.server";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import {
  ADD_ORG_INTENT,
  AddOrganisationForm,
} from "~/components/add-organization-form";
import { ADD_USER_INTENT, AddUserForm } from "~/components/add-user-form";
import { Button } from "~/components/ui/button";

import { createUser } from "~/services/users.server";

export const  loader = () => { 
  console.log("DASHBOARD SUPERUSER ROUTE LOADER");

  return Response.json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  
}

export default function SuperuserRoute() {
  const context = useOutletContext<{
    selectedOrg: Organization | null;
    setSelectedOrg: (org: Organization) => void;
  }>();

  return (
    <section>
     
      <Outlet context={context} />
    </section>
  );
}
