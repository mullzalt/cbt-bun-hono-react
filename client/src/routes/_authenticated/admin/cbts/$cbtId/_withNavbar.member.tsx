import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/admin/cbts/$cbtId/_withNavbar/member',
)({
  component: () => <div>Hello /_authenticated/admin/cbts/$cbtId/member!</div>,
})
