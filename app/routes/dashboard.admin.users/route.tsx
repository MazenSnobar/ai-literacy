import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { getAllUsers } from "~/services/users.server";
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
import { getAllOrg } from "../dashboard.superuser.organizations/queries";



export async function loader({ request }: LoaderFunctionArgs) {
  const organizations = await getAllOrg();
  return Response.json({organizations});
}

export default function () {
  const {organizations} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  return (
    <section>
      <h1>Organization</h1>
      <section className="grid grid-cols-4 gap-4">
      {organizations.map((organizations: any) => (
       <Card
       key={organizations.id}
       className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
     >
       <CardHeader className="space-y-1">
         <CardTitle className="text-xl text-gray-800 font-semibold">
           {organizations.name}
         </CardTitle>
         <CardDescription className="text-sm text-gray-500">
           {organizations.email}
         </CardDescription>
       </CardHeader>

       <CardContent className="pt-0">
         <div className="mt-1">
           <span className="text-sm font-medium text-gray-600">Role:</span>{" "}
           <Badge className="text-xs" variant="outline">
             {organizations.role}
           </Badge>
         </div>
       </CardContent>

       <CardFooter className="flex justify-end">
         <fetcher.Form method="post">
           <input type="hidden" name="_method" value="delete" />
           <input type="hidden" name="id" value={organizations.id} />
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
