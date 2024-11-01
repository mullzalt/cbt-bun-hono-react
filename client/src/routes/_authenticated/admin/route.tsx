import { createFileRoute, Outlet } from "@tanstack/react-router";

import { DashboardAdminLayout } from "@/components/layouts/dashboard/dashboard-layout";

export const Route = createFileRoute("/_authenticated/admin")({
  component: () => (
    <DashboardAdminLayout>
      <Outlet />
    </DashboardAdminLayout>
  ),
});
