import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";

import {
  invitationSearchSchema,
  invitationsInfiniteQueryOption,
} from "@/queries/invitation";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import { InvitationStatus } from "@/shared/schemas/invitation.schema";
import { Separator } from "@/components/ui/separator";
import { InvitationCard } from "@/components/layouts/invitations/invitation-card";
import { InvitationStatusToggle } from "@/components/layouts/invitations/invitation-status-toggle";
import {
  InfiniteListComponent,
  ListComponent,
} from "@/components/layouts/list-component";
import { InvitationForm } from "@/components/layouts/invitations/invitation-form";

export const Route = createFileRoute("/_authenticated/admin/users/invitations")(
  {
    component: Component,
    validateSearch: zodSearchValidator(invitationSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: ({ context, deps }) => {
      context.queryClient.ensureInfiniteQueryData(
        invitationsInfiniteQueryOption(deps),
      );
    },
    meta: () => [{ title: "Invitation" }],
  },
);

function Component() {
  const search = Route.useSearch();
  const [debouncedSearch] = useDebounce(search, 200);

  const result = useSuspenseInfiniteQuery(
    invitationsInfiniteQueryOption(debouncedSearch),
  );

  const navigate = useNavigate({ from: Route.fullPath });

  const handleStatus = useDebouncedCallback(
    (value: InvitationStatus) =>
      navigate({ search: (prev) => ({ ...prev, status: value }) }),
    100,
  );

  return (
    <div className="grid gap-4">
      <Separator />

      <div className="flex items-center justify-end">
      <InvitationForm/>
      </div>

      <Separator />

      <InvitationStatusToggle
        defaultValue={search.status}
        onChange={handleStatus}
      />

      <div className="text-muted-foreground text-sm italic flex items-center gap-4">
        <div>{result.data.pages[0].pagination.count} Invitation(s)</div>
      </div>

      <InfiniteListComponent
        {...result}
        render={(page, observer) => (
          <ListComponent
            data={page.data}
            render={(cbt) => <InvitationCard data={cbt} ref={observer} />}
          />
        )}
        renderOnLoading={() => <div>Loading...</div>}
      />
    </div>
  );
}
