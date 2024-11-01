import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/users/admins')({
  component: () => <div>Hello /_authenticated/admin/users/admin!</div>,
})
