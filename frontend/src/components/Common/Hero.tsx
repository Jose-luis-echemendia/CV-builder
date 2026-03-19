import { Box, Button, Heading, Text } from "@chakra-ui/react";

export const Hero = () => {
  return (
    <Box
      as="section"
      position="relative"
      minH="90vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={6}
      overflow="hidden"
      bg="brand.bg"
    >
      {/* Cuadrados decorativos */}
      <Box position="absolute" inset={0} zIndex={0} pointerEvents="none">
        <Box
          position="absolute"
          top={10}
          left={10}
          w="256px"
          h="256px"
          border="8px solid"
          borderColor="brand.primary"
          transform="rotate(12deg)"
          opacity={0.4}
        />
        <Box
          position="absolute"
          bottom={20}
          right={20}
          w="384px"
          h="384px"
          border="8px solid"
          borderColor="brand.secondary"
          transform="rotate(-12deg)"
          opacity={0.4}
        />
      </Box>

      {/* Contenido */}
      <Box position="relative" zIndex={1} textAlign="center" maxW="5xl">
        <Heading
          as="h1"
          fontSize={{ base: "7xl", md: "8xl" }}
          fontWeight="bold"
          lineHeight="1.05"
          letterSpacing="tighter"
          mb={6}
          textTransform="uppercase"
        >
          <Box as="span" display="block" color="brand.surface">
            CONSTRUYE TU
          </Box>
          <Box
            as="span"
            display="block"
            color="transparent"
            style={{ WebkitTextStroke: "2px #6366F1" }}
          >
            LEGADO
          </Box>
        </Heading>

        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="medium"
          maxW="2xl"
          mx="auto"
          mb={12}
          color="brand.textMuted"
        >
          Olvídate de lo ordinario. Construye una identidad profesional que
          transmita autoridad. Nuestros diseños radicales están hechos para
          quienes exigen atención.
        </Text>

        <Button
          size="2xl"
          bg="brand.primary"
          color="brand.textPrimary"
          fontSize="xl"
          px={12}
          py={6}
          
          margin={'auto'}
          fontWeight="bold"
          borderRadius={0}
          _hover={{
            bg: "brand.primaryHover",
            transform: "translate(2px, 2px)",
          }}
          boxShadow="8px 8px 0px 0px #FFFFFF"
          transition="all 0.15s"
        >
          EMPIEZA A CREAR →
        </Button>
      </Box>
    </Box>
  );
};
