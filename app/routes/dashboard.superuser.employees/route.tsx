import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { getSession } from "~/session/session.server";
import { getOrgEmployees } from "./queries";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    
    const session = await getSession(request.headers.get("Cookie"));
    const selectedOrgId = session.get("selectedOrgId");
    if (!selectedOrgId) {
        return Response.json({ employees: null });
      }
    const employees = await getOrgEmployees( selectedOrgId );
    return Response.json ({employees})
}
export default function ManageEmployeesPage() {
     const { employees } = useLoaderData<typeof loader>();
  
    return (
      <section>
        <h1 className="text-2xl font-bold mb-6">Manage Employees</h1>
        {!employees ? (
        <p className="text-gray-600 text-center mt-10">
          No organization selected. Please select an organization to view its employees.
        </p>
      ) : employees.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No employees found for the selected organization.
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {employees.map((employee: any) => (
            <Card key={employee.id} className="text-center">
              <CardHeader>
                <CardTitle>{employee.name}</CardTitle>
                <p className="text-sm text-gray-500">{employee.email}</p>
              </CardHeader>
              <CardContent>

              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      )}
    </section>
  );
}