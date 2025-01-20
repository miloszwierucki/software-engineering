import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    link: { to: string; search?: Record<string, unknown> };
    icon: LucideIcon;
    isDisabled?: boolean;
    items?: {
      title: string;
      link: { to: string; search?: Record<string, unknown> };
      icon: LucideIcon;
      isDisabled?: boolean;
    }[];
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild disabled={item.isDisabled}>
              <Link {...item.link}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>

            {/* Dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-48 z-[1000]"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                {/* Menu item (category) name */}
                <DropdownMenuItem disabled>
                  <span>{item.title}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {item.items?.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    asChild
                    disabled={item.isDisabled}
                  >
                    <Link {...item.link}>
                      <item.icon className="text-muted-foreground" />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
