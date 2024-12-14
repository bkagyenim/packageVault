import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courierPage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/courierPage"!</div>
}
