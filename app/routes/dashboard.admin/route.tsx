import { Outlet } from "@remix-run/react";

export default function() {
    <section>
        <h2 className="text-3xl font-bold text-gray-800">🛠 Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage your employees settings here., org, employees</p>
    </section> 
    return (
         <section>
              <Outlet/>
            </section>
    )
    
}