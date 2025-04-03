import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

// export const loader = redirectIfNotLoggedInLoader;

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ message: "Welcome to the Admin Dashboard" });
}

export default function RouteComponent() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-muted via-white to-muted/40 dark:from-background dark:to-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-primary to-secondary text-white p-6 shadow-lg">
        <h1 className="text-2xl font-extrabold tracking-wide mb-10">
          Admin Panel
        </h1>
        <nav className="space-y-3">
          <Button asChild variant="ghost" className="w-full justify-start text-white/90 hover:bg-white/10">
            <Link to="/dashboard">Dashboard Home</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-white/90 hover:bg-white/10">
            <Link to="/dashboard/users">View Users</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-white/90 hover:bg-white/10">
            <Link to="/dashboard/add-user"> Add User</Link>
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-4xl font-bold mb-8 text-foreground">
          Welcome back, Jerom 👋
        </h2>

        <Card className="bg-white/80 dark:bg-muted/60 backdrop-blur border shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-2xl">Manage Your Users</CardTitle>
            <CardDescription>
              Quickly access all user management tools from here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="default">
                <Link to="/dashboard/add-user"> Add New User</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/users">View All Users</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Nested Route Content */}
        <Outlet />
      </main>
    </div>
  );
}
