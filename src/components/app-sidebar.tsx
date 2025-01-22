import * as React from "react";
import { useTranslation } from "react-i18next";
import { Toggle } from "@/components/ui/toggle";
import {
  Command,
  Send,
  ListPlus,
  ListTree,
  Gift,
  FileText,
  MessagesSquare,
  Library,
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
import { useAuth } from "@/auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = React.useState(language);
  const { user } = useAuth();

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pl" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

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
    {
      title: t("sideNavBar.reportTitle"),
      link: { to: "/add_report" },
      icon: FileText,
      isDisabled: false,
      items: [
        {
          title: t("sideNavBar.manageTitle"),
          link: { to: "/manage_report" },
          icon: ListTree,
          isDisabled: false,
        },
        {
          title: t("sideNavBar.addTitle"),
          link: { to: "/add_report", search: { new: true } },
          icon: ListPlus,
          isDisabled: false,
        },
      ],
    },
    {
      title: t("sideNavBar.resourceTitle"),
      link: { to: "/add_resources" },
      icon: Library,
      isDisabled: false,
      items: [
        {
          title: t("sideNavBar.manageTitle"),
          link: { to: "/manage_resources" },
          icon: ListTree,
          isDisabled: false,
        },
        {
          title: t("sideNavBar.addTitle"),
          link: { to: "/add_resources", search: { new: true } },
          icon: ListPlus,
          isDisabled: false,
        },
      ],
    },
    {
      title: t("sideNavBar.chatTitle"),
      link: { to: "/chat" },
      icon: MessagesSquare,
      isDisabled: false,
      items: [],
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
          <SidebarMenuItem className="flex justify-between">
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
            <Toggle
              aria-label="Toggle language"
              onClick={handleChangeLanguage}
              className="uppercase"
            >
              {currentLanguage}
            </Toggle>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: `${user?.firstname || ""} ${user?.surname || ""}`,
            email: user?.email || "",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
