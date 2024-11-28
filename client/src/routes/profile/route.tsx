import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: () => <Outlet />,
  beforeLoad: async ({ context, location }) => {
    const data = await context.session.ensureSession();

    if (!data) {
      throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    }
  },
});
