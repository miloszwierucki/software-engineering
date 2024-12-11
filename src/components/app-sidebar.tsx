import * as React from "react";
import { Command, Send, ListPlus, ListTree, Gift } from "lucide-react";

import { useTranslation } from "react-i18next";
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const { t } = useTranslation();

  const navMain = [
    {
      title: t("sideNavBar.donationTitle"),
      link: { to: "/donations" },
      icon: Gift,
      isDisabled: false,
      items: [
        {
          title: t("sideNavBar.manageTitle"),
          link: { to: "/donations" },
          icon: ListTree,
          isDisabled: false,
        },
        {
          title: t("sideNavBar.addTitle"),
          link: { to: "/donations", search: { new: true } },
          icon: ListPlus,
          isDisabled: false,
        },
      ],
    },
  ];
  const navSecondary = [
    {
      title: "Feedback",
      link: { to: "/#" },
      icon: Send,
    },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/#">
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
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
