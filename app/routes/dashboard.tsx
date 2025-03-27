import { useLoaderData } from "@remix-run/react";
import { redirectIfNotLoggedInLoader } from "./services/auth";

export const loader = redirectIfNotLoggedInLoader;


export default function RouteComponent(){
  const data = useLoaderData<typeof loader>()
  return (

    <div> accessed dashboard </div>
  );
}