import * as React from "react";
import {
  Command,
  Send,
  SquareTerminal,
  ListPlus,
  ListTree,
} from "lucide-react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  // TODO: add user data
  user: {
    name: "sheldon",
    email: "system@slave.com",
    avatar: "",
  },
  // TODO: add all nav items
  navMain: [
    {
      title: "Zgłoszenia",
      url: "/reports",
      icon: SquareTerminal,
      isDisabled: false,
      items: [
        {
          title: "Zarządzaj",
          url: "/reports",
          icon: ListTree,
          isDisabled: false,
        },
        {
          title: "Dodaj",
          url: "/reports?new=true",
          icon: ListPlus,
          isDisabled: false,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
