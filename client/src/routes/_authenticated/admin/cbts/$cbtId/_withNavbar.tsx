import * as React from 'react'
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'

import { cbtQueryOption } from '@/queries/cbt'
import { PencilRulerIcon, SettingsIcon, UsersIcon } from 'lucide-react'

import { TabButton, TabButtonContainer } from '@/components/layouts/tab-button'

export const Route = createFileRoute(
  '/_authenticated/admin/cbts/$cbtId/_withNavbar',
)({
  component: AdminCbtLayout,
  loader: async ({ params: { cbtId }, context }) => {
    const cbt = await context.queryClient.ensureQueryData(cbtQueryOption(cbtId))

    return { cbt: cbt.data }
  },
  meta: ({ loaderData: { cbt } }) => [
    {
      title: cbt.name,
    },
  ],
  notFoundComponent: () => <div>Not found</div>,
})

function AdminCbtLayout() {
  const { cbtId } = Route.useParams()

  const basePath = `/admin/cbts/${cbtId}`

  const location = useLocation()
  return (
    <React.Fragment>
      <div className="flex flex-col">
        <TabButtonContainer>
          <TabButton asChild isActive={location.pathname === basePath}>
            <Link to="/admin/cbts/$cbtId" params={{ cbtId }}>
              <PencilRulerIcon className="size-4" />
              Module Subject
            </Link>
          </TabButton>
          <TabButton
            asChild
            isActive={location.pathname === basePath + '/member'}
          >
            <Link to="/admin/cbts/$cbtId/member" params={{ cbtId }}>
              <UsersIcon className="size-4" />
              Member
            </Link>
          </TabButton>
          <TabButton
            asChild
            isActive={location.pathname === basePath + '/setting'}
          >
            <Link to="/admin/cbts/$cbtId/setting" params={{ cbtId }}>
              <SettingsIcon className="size-4" />
              Setting
            </Link>
          </TabButton>
        </TabButtonContainer>
      </div>
      <Outlet />
    </React.Fragment>
  )
}
