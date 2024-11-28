import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: () => <Outlet />,
  beforeLoad: async ({ context, location }) => {
    const data = await context.session.ensureSession();

    if (!data) {
      throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    }

    const { metadata: states } = data;

    if (states.shouldFillStudentProfile) {
      throw redirect({
        to: "/profile/new-student",
        search: { redirect: location.href },
      });
    }

    if (states.shouldFillProfile) {
      throw redirect({
        to: "/profile/new-user",
        search: { redirect: location.href },
      });
    }

    if (states.shouldFillPassword) {
      throw redirect({
        to: "/profile/create-password",
        search: { redirect: location.href },
      });
    }
  },
});
