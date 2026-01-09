import { lazy } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";

const ResetPasswordPage = lazy(() => import("@/pages/reset-password"));

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function ResetPassword() {
  return (
    <>
      <ResetPasswordPage />
    </>
  );
}
