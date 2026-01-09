import { lazy } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";

const LoginPage = lazy(() => import("@/pages/login"));

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function Login() {
  return (
    <>
      <LoginPage />
    </>
  );
}
