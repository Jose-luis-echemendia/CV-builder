import { lazy } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";

const SignUpPage = lazy(() => import("@/pages/signup"));

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function SignUp() {
  return (
    <>
      <SignUpPage />
    </>
  );
}
