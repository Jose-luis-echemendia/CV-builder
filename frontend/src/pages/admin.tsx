import {
  Badge,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

import { UsersService } from "@/client";
import AddUser from "@/components/Admin/AddUser";
import PendingUsers from "@/components/Pending/PendingUsers";
import { UserActionsMenu } from "@/components/Common/UserActionsMenu";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/useAuthStore";

const PER_PAGE = 5;

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  };
}

type AdminPageProps = {
  page: number;
  onPageChange: (page: number) => void;
};

function UsersTable({ page, onPageChange }: AdminPageProps) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    ...getUsersQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
    enabled: !!token,
  });

  const users = data?.data.slice(0, PER_PAGE) ?? [];
  const count = data?.count ?? 0;

  if (isLoading) {
    return <PendingUsers />;
  }

  if (isError) {
    return (
      <Center
        p={10}
        border="1px dashed"
        borderColor="border.subtle"
        borderRadius="l3"
      >
        <VStack gap={4}>
          <Icon fontSize="4xl" color="red.500">
            <FiAlertCircle />
          </Icon>
          <VStack gap={1}>
            <Text fontWeight="bold">Error al cargar usuarios</Text>
            <Text color="fg.muted" textAlign="center" fontSize="sm">
              {(error as any)?.body?.message?.description ||
                (error as any)?.message ||
                "Error desconocido"}
            </Text>
          </VStack>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["users"] })
            }
            leftHash={<FiRefreshCw />}
          >
            Reintentar
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="sm">Email</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Role</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Status</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users?.map((user) => (
            <Table.Row key={user.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell truncate maxW="sm">
                {user.email}
                {currentUser?.id === user.id && (
                  <Badge ml="1" colorScheme="teal">
                    You
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                {user.is_superuser ? "Superuser" : "User"}
              </Table.Cell>
              <Table.Cell>{user.is_active ? "Active" : "Inactive"}</Table.Cell>
              <Table.Cell>
                <UserActionsMenu
                  user={user}
                  disabled={currentUser?.id === user.id}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count}
          pageSize={PER_PAGE}
          onPageChange={({ page }) => onPageChange(page)}
        >
          <Flex>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  );
}

const Admin = ({ page, onPageChange }: AdminPageProps) => {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        Users Management
      </Heading>

      <AddUser />
      <UsersTable page={page} onPageChange={onPageChange} />
    </Container>
  );
};

export default Admin;
