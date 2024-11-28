import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

import { validateSession } from "@/queries/auth";

import { useSession } from "@/hooks/use-session";
import { ButtonExtra } from "@/components/button-extra";
import { DashboardAdminLayout } from "@/components/layouts/dashboard/dashboard-layout";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const { signOut, isSignOutPending, user } = useSession();
  const router = useRouter();
  const navigate = useNavigate();
  // const user = Route.useLoaderData();
  //
  // if (user.role === "admin") {
  //   return (
  //     <DashboardAdminLayout>
  //       <pre>{JSON.stringify(user, null, 2)}</pre>
  //     </DashboardAdminLayout>
  //   );
  // }
  return (
    <div>
      <ButtonExtra
        isLoading={isSignOutPending}
        onClick={async () =>
          await signOut(undefined, {
            onSuccess: async () => {
              router.invalidate();
              await navigate({ to: "/sign-in" });
            },
          })
        }
      >
        Sign Out
      </ButtonExtra>
      <pre>{JSON.stringify(user!, null, 2)}</pre>
    </div>
  );
}
