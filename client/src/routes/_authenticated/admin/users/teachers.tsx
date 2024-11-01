import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/users/teachers')({
  component: () => <div>Hello /_authenticated/admin/users/teacher!</div>,
})
