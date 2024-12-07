import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/add_resources')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="p-2">Hello /_auth/add_report!</div>;
}
