import { Box, Container, Text } from "@chakra-ui/react";

import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
  const { user: currentUser } = useAuth();

  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl" truncate maxW="sm">
            Hi, {currentUser?.email} 👋🏼
          </Text>
          <Text>Welcome back, nice to see you again!</Text>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
