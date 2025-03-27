import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUser } from "~/session/guards.server";
import { redirectIfNotLoggedInLoader } from "./services/auth";

export const loader = redirectIfNotLoggedInLoader;


export default function RouteComponent(){
  const data = useLoaderData<typeof loader>()
  return (

    <div> accessed dashboard </div>
  );
}