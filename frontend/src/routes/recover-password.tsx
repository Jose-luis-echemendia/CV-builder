import { lazy } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";

const RecoverPasswordPage = lazy(() => import("@/pages/recover-password"));

export const Route = createFileRoute("/recover-password")({
  component: RecoverPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RecoverPassword() {
  return (
    <>
      <RecoverPasswordPage />
    </>
  );
}
