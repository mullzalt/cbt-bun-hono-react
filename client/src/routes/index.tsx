import { createFileRoute, redirect } from "@tanstack/react-router";

import { validateSession } from "@/queries/auth";

import { HeroMainSection } from "@/components/layouts/hero/hero-main-section";
import { LandingNavbar } from "@/components/layouts/hero/landing-navbar";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad: async ({ context }) => {
    const user = await validateSession(context.queryClient);

    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function HomeComponent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <LandingNavbar />
      <HeroMainSection />
    </div>
  );
}
