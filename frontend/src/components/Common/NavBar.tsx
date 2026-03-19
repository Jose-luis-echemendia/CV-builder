import { Box, Flex, Text, Button, HStack } from '@chakra-ui/react';
import { BsLightningFill } from 'react-icons/bs';

export default function Navbar() {
  return (
    <Box bg='black' borderBottom='1px solid' borderColor='brand.border' >
      <Flex
        maxW='container.7xl'
        mx='auto'
        px={6}
        py={4}
        align='center'
        justify='space-between'
      >
        {/* Logo + Links */}
        <HStack>
          <Text fontWeight='extrabold' fontSize='lg' className='text-primary' letterSpacing='wide'>
            BOLD CV
          </Text>

          <HStack>
            <Text
              color='white'
              fontWeight='medium'
              cursor='pointer'
              _hover={{ color: 'brand.primaryHover' }}
            >
              Plantillas
            </Text>
            <Text
              color='white'
              fontWeight='medium'
              cursor='pointer'
              _hover={{ color: 'brand.primaryHover' }}
            >
              Precios
            </Text>
          </HStack>
        </HStack>

        {/* Right side */}
        <HStack>
          <Box color='white' cursor='pointer'>
            <BsLightningFill size={20} />
          </Box>

          <Button
            bg='brand.primary'
            color='white'
            fontWeight='bold'
            px={6}
            _hover={{ bg: 'brand.primaryHover' }}
            borderRadius='md'
          >
            Login
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
