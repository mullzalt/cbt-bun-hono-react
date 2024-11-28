import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { cbtQueryOption } from '@/queries/cbt'
import { cbtModulesQueryOption } from '@/queries/cbt-module'
import { useSortCbtModules } from '@/queries/mutations/use-sort-cbt-module'
import { DndContext } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { DragHandleDots2Icon } from '@radix-ui/react-icons'

import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/sortable'
import { ListComponent } from '@/components/layouts/list-component'

export const Route = createFileRoute(
  '/_authenticated/admin/cbts/$cbtId/_withNavbar/',
)({
  component: CbtModuleComponent,
  loader: async ({ params: { cbtId }, context }) => {
    const cbt = await context.queryClient.ensureQueryData(cbtQueryOption(cbtId))
    const cbtModules = await context.queryClient.ensureQueryData(
      cbtModulesQueryOption({ cbtId }),
    )

    return { cbt: cbt.data, cbtModules: cbtModules.data }
  },
  meta: ({ loaderData: { cbt } }) => [
    {
      title: cbt.name,
    },
  ],
})

function CbtModuleComponent() {
  const { cbt, cbtModules } = Route.useLoaderData()
  const { cbtId } = Route.useParams()
  const { mutate: move } = useSortCbtModules({ cbtId: cbt.id })
  const [data, setData] = React.useState(cbtModules)

  return (
    <React.Fragment>
      <DndContext>
        <Sortable
          value={data}
          overlay={
            <div className="grid grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
              <div className="h-8 w-full rounded-sm bg-primary/10" />
              <div className="h-8 w-full rounded-sm bg-primary/10" />
              <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
              <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
            </div>
          }
          onMove={({ activeIndex, overIndex }) => {
            const prevData = data
            move({ data: prevData, activeIndex, overIndex })
            setData((prev) => arrayMove(prev, activeIndex, overIndex))
          }}
        >
          <div className="flex w-full flex-col gap-2">
            <ListComponent
              data={data}
              render={(cbtModule) => (
                <SortableItem key={cbtModule.id} value={cbtModule.id} asChild>
                  <div className="grid grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
                    <div>
                      <Link
                        to="/admin/cbts/$cbtId/questions/$cbtModuleId"
                        params={{
                          cbtId,
                          cbtModuleId: cbtModule.id,
                        }}
                      >
                        {cbtModule.subject}
                      </Link>
                    </div>
                    <SortableDragHandle
                      variant="outline"
                      size="icon"
                      className="size-8 shrink-0"
                      // disabled={cbt.metadata.status !== "unpublished"}
                    >
                      <DragHandleDots2Icon
                        className="size-4"
                        aria-hidden="true"
                      />
                    </SortableDragHandle>
                  </div>
                </SortableItem>
              )}
            />
          </div>
        </Sortable>
      </DndContext>
    </React.Fragment>
  )
}
