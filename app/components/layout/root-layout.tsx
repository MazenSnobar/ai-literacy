import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="flex-1 p-4 bg-blue-50 min-h-screen border">
        {children}
      </main>
  );
}
