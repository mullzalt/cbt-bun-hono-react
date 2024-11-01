import { createFileRoute, redirect } from "@tanstack/react-router";

import { validateSession } from "@/queries/auth";

import { DashboardAdminLayout } from "@/components/layouts/dashboard/dashboard-layout";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardComponent,
  loader: async ({ context, location }) => {
    const user = await validateSession(context.queryClient);
    if (!user) {
      throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    }

    return user;
  },
});

function DashboardComponent() {
  const user = Route.useLoaderData();

  if (user.role === "admin") {
    return (
      <DashboardAdminLayout>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </DashboardAdminLayout>
    );
  }
}
