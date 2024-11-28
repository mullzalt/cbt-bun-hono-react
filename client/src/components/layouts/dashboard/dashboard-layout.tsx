import * as React from "react";

import { useMetaTitle } from "@/hooks/use-metatitle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";
import { AdminSidebarContent } from "./nav-main";

export function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { title } = useMetaTitle();
  return (
    <SidebarProvider>
      <AppSidebar renderContent={AdminSidebarContent} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h2 className="text-lg ">{title}</h2>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
