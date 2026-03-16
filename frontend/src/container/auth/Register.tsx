import { useRegisterMutation } from '@/hooks/auth/useRegisterMutation';
import {
  RegisterFormData,
  RegisterSchema,
} from '@/schemas/auth/register.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';
import { InputGroup } from '@/components/ui/input-group';

export const Register = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onBlur',
    criteriaMode: 'all',
  });

  const { mutate: registerUser, isPending } = useRegisterMutation();

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Flex minH='100vh' bg='brand.bg'>
      {/* Right Panel - Form */}
      <Flex
        flex='1'
        direction='column'
        justifyContent='center'
        alignItems='center'
        px={{ base: 6, md: 12 }}
        py={12}
        bg='brand.bg'
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
            ÚNETE A LA REBELIÓN
          </Heading>

          <Text color='brand.textMuted' mb={10} fontSize='sm'>
            Ingresa tus datos para reclamar tu espacio creativo.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={6} align='stretch'>
              {/* Email */}
              <Field
                label='CORREO ELECTRÓNICO'
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

              {/* Create Account Button */}
              <Button
                type='submit'
                loading={isPending}
                loadingText='CREANDO...'
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
                CREAR CUENTA
              </Button>

              {/* Google Sign Up Button */}
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
                REGISTRARSE CON GOOGLE
              </Button>

              <Separator borderColor='brand.border' />

              {/* Login Link */}
              <Text textAlign='center' color='brand.textMuted' fontSize='sm'>
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href='/login'
                  color='brand.surface'
                  fontWeight='bold'
                  _hover={{ color: 'brand.primary' }}
                  textDecoration='underline'
                >
                  Iniciar sesión
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Flex>
  );
};
