import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/about")({
  component: AboutRoute,
});

function AboutRoute() {
  return <div className="p-2">Hello from About!</div>;
}
