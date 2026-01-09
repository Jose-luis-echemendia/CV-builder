import { lazy } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const AdminPage = lazy(() => import("@/pages/admin"));

const usersSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
  validateSearch: (search: Record<string, unknown>) =>
    usersSearchSchema.parse(search),
});

function Admin() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();

  const setPage = (newPage: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page: newPage }),
    });

  return (
    <>
      <AdminPage page={page} onPageChange={setPage} />
    </>
  );
}
