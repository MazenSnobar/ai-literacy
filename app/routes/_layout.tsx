import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Outlet />
        </div>
    );
}
