import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
  } from "~/components/ui/sidebar"
  import { Link } from "@remix-run/react"
  import { Users, Building2 } from "lucide-react"
import { Organization } from "~/services/prisma.server"
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card"
  
export function AppSidebar({ selectedOrg }: { selectedOrg: Organization | null }) {
    return (
      <Sidebar>
        <SidebarHeader>
          
          <h1 className="text-lg font-bold">Dashboard</h1>
        </SidebarHeader>
        {selectedOrg && (
    <Card className="mx-2 mb-2 bg-sidebar-accent text-sidebar-accent-foreground shadow-none text-center">

      <CardHeader>
        <CardTitle className="text-sm font-semibold">Selected Org</CardTitle>
        <CardDescription className="text-s">
          {selectedOrg.name}
          <br />
          {selectedOrg.email}
        </CardDescription>
      </CardHeader>
    </Card>
  )}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarMenu>

              <SidebarMenuItem>  
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/superuser/users" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Manage Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/superuser/organizations" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Manage Organizations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>  
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/superuser/employees" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Manage Employees</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
  
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton variant="outline">
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }
  