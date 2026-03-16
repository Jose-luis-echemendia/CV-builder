import { Flex } from '@chakra-ui/react';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import Header from '@/components/Common/Navbar';

export const Route = createFileRoute('/_layout')({
  component: Layout,
});

function Layout() {
  return (
    <Flex direction='column' h='100vh'>
      <Flex flex='1' overflow='hidden'>
        <Flex flex='1' direction='column' p={4} overflowY='auto'>
          <Header/>
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Layout;
