import { useNavigate } from "@tanstack/react-router";

import { SessionUser } from "@/queries/auth";
import {
  ChevronsUpDown,
  LogOut,
  LogOutIcon,
  UserRoundIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { nameInitials } from "@/lib/string";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ButtonExtra } from "@/components/button-extra";

export function NavUser() {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const { user, signOut, isSignOutPending } = useSession();

  if (!user) {
    return <SidebarMenuSkeleton />;
  }

  if (!user.profile) {
    return <SidebarMenuSkeleton />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.profile.image || ""}
                  alt={user.profile.name}
                />
                <AvatarFallback
                  className="rounded-lg"
                  style={{
                    backgroundColor: user.profile.metadata.colorFallback,
                  }}
                >
                  {nameInitials(user.profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.profile.name}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className={cn("h-8 w-8 rounded-lg")}>
                  <AvatarImage
                    src={user.profile.image || undefined}
                    alt={user.profile.name}
                  />
                  <AvatarFallback
                    className={cn("rounded-lg")}
                    style={{
                      backgroundColor: user.profile.metadata.colorFallback,
                    }}
                  >
                    {nameInitials(user.profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.profile.name}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRoundIcon />
                {t("terms.account")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () =>
                await signOut(undefined, {
                  onSuccess: async () => {
                    await navigate({ to: "/sign-in" });
                  },
                })
              }
            >
              <LogOutIcon /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
