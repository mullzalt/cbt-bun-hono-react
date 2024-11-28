import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";

import {
  subjectSearchSchema,
  subjectsInfiniteQueryOptions,
} from "@/queries/subject";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  InfiniteListComponent,
  ListComponent,
} from "@/components/layouts/list-component";
import { SubjectRow } from "@/components/layouts/subject/subject-row";
import { SubjectForm } from "@/components/layouts/subject/subject-form";

export const Route = createFileRoute("/_authenticated/admin/subjects/")({
  validateSearch: zodSearchValidator(subjectSearchSchema),
  loaderDeps: ({ search }) => search,
  component: Component,
});

function Component() {
  const search = Route.useSearch();
  const [debouncedSearch] = useDebounce(search, 200);

  const result = useSuspenseInfiniteQuery(
    subjectsInfiniteQueryOptions(debouncedSearch),
  );

  const navigate = useNavigate({ from: Route.fullPath });

  const handleSearch = useDebouncedCallback(
    (value: string) => navigate({ search: (prev) => ({ ...prev, q: value }) }),
    500,
  );

  return (
    <>
      <Separator />
      <div className="flex items-center justify-between gap-8">
        <div className="flex  items-center col-span-8 lg:col-span-7 gap-2 flex-grow">
          <Input
            placeholder="Search subject..."
            defaultValue={search.q}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="text-muted-foreground text-sm italic flex items-center gap-4">
        <div>{result.data.pages[0].pagination.count} Subject(s)</div>
      </div>
      <Separator />
      <SubjectForm />
      <Separator />

      <InfiniteListComponent
        {...result}
        render={(page, observer) => (
          <ListComponent
            data={page.data}
            render={(subject) => <SubjectRow data={subject} ref={observer} />}
          />
        )}
        renderOnLoading={() => <div>Loading...</div>}
      />
    </>
  );
}
