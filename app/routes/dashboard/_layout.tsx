import { Outlet, Link } from "@remix-run/react";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
        <nav>
          <ul className="space-y-4">
            <li><Link to="/dashboard" className="hover:underline">Home</Link></li>
            <li><Link to="/dashboard/users" className="hover:underline">Users</Link></li>
            <li><Link to="/dashboard/add-user" className="hover:underline">Add User</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
