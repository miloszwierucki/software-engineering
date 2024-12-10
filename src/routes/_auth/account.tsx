import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/account")({
  component: RouteComponent,
});

// TODO: Add account page
function RouteComponent() {
  return "Hello /_auth/account!";
}
