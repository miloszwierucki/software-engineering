import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const protectRoute = (
  context: { auth: any },
  allowedRoles: string | string[]
) => {
  const userRole = context.auth.user?.role.toLowerCase();
  const roles = Array.isArray(allowedRoles) 
    ? allowedRoles.map(role => role.toLowerCase())
    : [allowedRoles.toLowerCase()];
  console.log(userRole);
  if (userRole === undefined || !roles.includes(userRole)) {
    throw redirect({
      to: "/unauthorized",
    });
  }
};

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    context.auth.user = { // do testów
      id: "1",
      firstname: "Jan",
      surname: "Kowalski",
      email: "jan.kowalski@example.com",
      phone: "123456789",
      role: "charity" // "victim" | "donator" | "volunteer" | "charity"
    };

    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
