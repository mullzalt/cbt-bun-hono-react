import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DashboardAdminLayout } from "@/components/layouts/dashboard/dashboard-layout";

export const Route = createFileRoute("/_authenticated/admin")({
  component: Component,
  beforeLoad: async ({ context }) => {
    const { user } = context.session;

    if (user && user.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function Component() {
  return (
    <DashboardAdminLayout>
      <Outlet />
    </DashboardAdminLayout>
  );
}
