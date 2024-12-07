import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/manage_report')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_auth/manage_report!'
}
