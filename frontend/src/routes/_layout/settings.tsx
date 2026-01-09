import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const UserSettingsPage = lazy(() => import("@/pages/user-settings"));

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
});

function UserSettings() {
  return (
    <>
      <UserSettingsPage />
    </>
  );
}
