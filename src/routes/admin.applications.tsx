import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pathless wrapper: /admin/applications/$id renders here via <Outlet />.
// We don't expose /admin/applications directly — everything lives at /admin.
export const Route = createFileRoute("/admin/applications")({
  component: () => <Outlet />,
});
