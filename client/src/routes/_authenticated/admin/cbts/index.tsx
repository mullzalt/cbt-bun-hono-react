import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";

import { cbtInfiniteQueryOptions, cbtSearchSchema } from "@/queries/cbt";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import { CbtStatus } from "@/shared/query/cbt.query.schema";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AdminCbtCard } from "@/components/layouts/cbt/admin-cbt-card";
import { CbtForm } from "@/components/layouts/cbt/admin-cbt-form";
import { CbtStatusOptions } from "@/components/layouts/cbt/cbt-filter-status";
import {
  InfiniteListComponent,
  ListComponent,
} from "@/components/layouts/list-component";

export const Route = createFileRoute("/_authenticated/admin/cbts/")({
  component: CbtsComponent,
  validateSearch: zodSearchValidator(cbtSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    context.queryClient.ensureInfiniteQueryData(cbtInfiniteQueryOptions(deps));
  },
  meta: () => [{ title: "CBT Module" }],
});

function CbtsComponent() {
  const search = Route.useSearch();
  const [debouncedSearch] = useDebounce(search, 200);

  const result = useSuspenseInfiniteQuery(
    cbtInfiniteQueryOptions(debouncedSearch),
  );

  const navigate = useNavigate({ from: Route.fullPath });

  const handleSearch = useDebouncedCallback(
    (value: string) => navigate({ search: (prev) => ({ ...prev, q: value }) }),
    500,
  );

  const handleStatus = useDebouncedCallback(
    (value: CbtStatus) =>
      navigate({ search: (prev) => ({ ...prev, status: value }) }),
    500,
  );

  return (
    <>
      <div className="flex items-center justify-between gap-8">
        <div className="flex  items-center col-span-8 lg:col-span-7 gap-2 flex-grow">
          <Input
            placeholder="Search CBT Modules..."
            defaultValue={search.q}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <CbtStatusOptions value={search.status} onChange={handleStatus} />
        </div>
      </div>
      <div className="text-muted-foreground text-sm italic flex items-center gap-4">
        <div>{result.data.pages[0].pagination.count} Module(s)</div>
      </div>

      <Separator />
      <div className="flex justify-end">
        <CbtForm />
      </div>
      <Separator />

      <InfiniteListComponent
        {...result}
        render={(page, observer) => (
          <ListComponent
            data={page.data}
            render={(cbt) => <AdminCbtCard data={cbt} ref={observer} />}
          />
        )}
        renderOnLoading={() => <div>Loading...</div>}
      />
    </>
  );
}
