import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import {
  BookOpenIcon,
  IdCardIcon,
  PencilRulerIcon,
  UserCogIcon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function AdminSidebarContent() {
  const { t } = useTranslation();
  const { pathname } = useRouterState({
    select: (state) => state.location,
  });

  return (
    <React.Fragment>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>{t("terms.cbt")}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/cbts"}>
              <Link to="/admin/cbts">
                <BookOpenIcon />
                {t("terms.module")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/admin/subjects"}
            >
              <Link to="/admin/subjects">
                <PencilRulerIcon />
                {t("terms.subject")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>{t("terms.user")}</SidebarGroupLabel>
        <SidebarMenu>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/admin/users/invitations"}
            >
              <Link to="/admin/users/invitations">
                <IdCardIcon />
                Invitation
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/admin/users/admins"}
            >
              <Link to="/admin/users/admins">
                <UserCogIcon />
                {t("terms.admin")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/admin/users/teachers"}
            >
              <Link to="/admin/users/teachers">
                <Users2Icon />
                {t("terms.teacher")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/admin/users/students"}
            >
              <Link to="/admin/users/students">
                <UsersIcon />
                {t("terms.student")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </React.Fragment>
  );
}
