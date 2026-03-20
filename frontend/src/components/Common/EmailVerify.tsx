import { useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useVerifyEmailMutation } from '@/hooks/auth/useVerifyEmailMutation';
import { Box, Flex, Heading, Text, VStack, Icon, Spinner } from '@chakra-ui/react';
import { FiMail, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const EmailVerify = () => {
  const { token } = useSearch({ from: '/verify-email' });
  const navigate = useNavigate();
  const { mutate: verifyEmail, isPending, isSuccess, isError } = useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      verifyEmail(token, {
        onSuccess: () => {
          setTimeout(() => {
            navigate({ to: '/login' });
          }, 3000);
        },
      });
    }
  }, [token, verifyEmail, navigate]);

  return (
    <Flex minH="100vh" bg="brand.bg" justifyContent="center" alignItems="center">
      <Box w="full" maxW="md" textAlign="center" px={6}>
        <VStack gap={6}>

          {!token && (
            <>
              <Icon as={FiMail} boxSize={16} color="brand.primary" />
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="900"
                color="brand.surface"
                textTransform="uppercase"
              >
                REVISA TU CORREO
              </Heading>
              <Text color="brand.textMuted" fontSize="md">
                Te hemos enviado un enlace de verificación a tu correo electrónico.
                Haz clic en el enlace para activar tu cuenta.
              </Text>
              <Text color="brand.textMuted" fontSize="sm">
                Si no lo encuentras, revisa tu carpeta de spam.
              </Text>
            </>
          )}

          {/* Verifying */}
          {token && isPending && (
            <>
              <Spinner size="xl" color="brand.primary" />
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="900"
                color="brand.surface"
                textTransform="uppercase"
              >
                VERIFICANDO...
              </Heading>
              <Text color="brand.textMuted" fontSize="md">
                Estamos verificando tu correo electrónico.
              </Text>
            </>
          )}

          {/* Success */}
          {token && isSuccess && (
            <>
              <Icon as={FiCheckCircle} boxSize={16} color="green.400" />
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="900"
                color="brand.surface"
                textTransform="uppercase"
              >
                CORREO VERIFICADO
              </Heading>
              <Text color="brand.textMuted" fontSize="md">
                Tu cuenta ha sido activada exitosamente.
                Serás redirigido al inicio de sesión...
              </Text>
            </>
          )}

          {/* Error */}
          {token && isError && (
            <>
              <Icon as={FiXCircle} boxSize={16} color="red.400" />
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="900"
                color="brand.surface"
                textTransform="uppercase"
              >
                ERROR DE VERIFICACIÓN
              </Heading>
              <Text color="brand.textMuted" fontSize="md">
                No pudimos verificar tu correo. El enlace puede haber expirado o ser inválido.
              </Text>
            </>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};
