import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { PasswordInput } from '@/components/ui/password-input';
import { useLoginMutation } from '@/hooks/auth/useLoginMutation';
import { LoginFormData, LoginSchema } from '@/schemas/auth/login.schema';
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  VStack,
  Separator,
  Link,
  Icon,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { FiLock, FiMail } from 'react-icons/fi';

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onBlur',
    criteriaMode: 'all',
  });

  const { mutate: loginUser, isPending } = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    const payload = {
      email: data.email,
      password: data.password,
    };
    loginUser(payload);
  };

  return (
    <Flex
      minH='100vh'
      bg='brand.bg'
      direction='column'
      justifyContent='center'
      alignItems='center'
      px={{ base: 6, md: 12 }}
      py={12}
    >
      <Box w='full' maxW='md'>
        <Heading
          as='h2'
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight='900'
          color='brand.surface'
          textTransform='uppercase'
          mb={2}
        >
          Bienvenido de nuevo
        </Heading>

        <Text color='brand.textMuted' mb={10} fontSize='sm'>
          Construye tu legado empezando ahora.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={6} align='stretch'>
            {/* Email */}
            <Field
              label='CORREO ELECTRÓNICO'
              color={'brand.primary'}
              invalid={!!errors.email}
              errorText={errors.email?.message}
            >
              <InputGroup
                width='100%'
                startElement={<Icon as={FiMail} color='brand.textMuted' />}
              >
                <Input
                  {...register('email')}
                  type='email'
                  placeholder='ALEX@REBEL.IO'
                  bg='brand.bgMuted'
                  border='1px solid'
                  borderColor='brand.border'
                  color='brand.surface'
                  _placeholder={{
                    color: 'brand.textMuted',
                    textTransform: 'uppercase',
                  }}
                  size='lg'
                  borderRadius={0}
                />
              </InputGroup>
            </Field>

            {/* Password */}
            <Field
              label='CONTRASEÑA'
              color={'brand.primary'}
              invalid={!!errors.password}
              errorText={errors.password?.message}
            >
              <PasswordInput
                {...register('password')}
                type='password'
                errors={errors}
                placeholder='••••••••'
                bg='brand.bgMuted'
                border='1px solid'
                borderColor='brand.border'
                color='brand.surface'
                size='lg'
                borderRadius={0}
                startElement={<Icon as={FiLock} color='brand.textMuted' />}
              />
            </Field>

            {/* Login Button */}
            <Button
              type='submit'
              loading={isPending}
              loadingText='INGRESANDO...'
              w='full'
              size='lg'
              bg='brand.primary'
              color='brand.textPrimary'
              fontWeight='bold'
              fontSize='sm'
              letterSpacing='widest'
              textTransform='uppercase'
              borderRadius={0}
              py={7}
              _hover={{
                bg: 'brand.primaryHover',
                transform: 'translate(2px, 2px)',
              }}
              boxShadow='6px 6px 0px 0px #4F46E5'
              transition='all 0.15s'
            >
              LOGIN
            </Button>

            {/* Google Login Button */}
            <Button
              variant='outline'
              w='full'
              size='lg'
              bg='white'
              color='brand.textInverse'
              fontWeight='bold'
              fontSize='sm'
              letterSpacing='widest'
              textTransform='uppercase'
              borderRadius={0}
              py={7}
              border='2px solid'
              borderColor='brand.textPrimary'
              _hover={{
                bg: 'gray.100',
              }}
            >
              <Icon as={FaGoogle} mr={2} />
              CONTINUAR CON GOOGLE
            </Button>

            <Separator borderColor='brand.border' />

            {/* Register Link */}
            <Text textAlign='center' color='brand.textMuted' fontSize='sm'>
              ¿No tienes una cuenta?{' '}
              <Link
                href='/register'
                color='brand.surface'
                fontWeight='bold'
                _hover={{ color: 'brand.primary' }}
                textDecoration='underline'
              >
                Regístrate
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};
