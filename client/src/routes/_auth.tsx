import { z } from "zod";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";

const searchSchema = z.object({
  redirect: fallback(z.string(), "/dashboard").default("/dashboard"),
});

export const Route = createFileRoute("/_auth")({
  component: () => <Outlet />,
  validateSearch: zodSearchValidator(searchSchema),
  beforeLoad: async ({ context, search }) => {
    const data = await context.session.ensureSession();

    if (data) {
      throw redirect({ to: search.redirect });
    }
  },
});
