import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/cbts/')({
  component: () => <div>Hello /_authenticated/admin/cbts/!</div>,
})
