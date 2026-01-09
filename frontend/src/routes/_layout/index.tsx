import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const DashboardPage = lazy(() => import("@/pages/dashboard"));

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
