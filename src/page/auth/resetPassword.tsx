import { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { authApi } from '../../api/services/authService';
import WelcomeCard from './WelcomeCard';
import FloatingInput from '@/components/ui/floating-input';
import { Icons } from '@/src/utils/icons';

type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { colorScheme } = useColorScheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ResetPasswordRouteProp>();
  const { email, otpCode } = route.params;

  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#94a3b8' : '#9ca3af';

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const newPasswordValue = watch('newPassword');
  const confirmPasswordValue = watch('confirmPassword');

  const isNewPasswordValid =
    !errors.newPassword && dirtyFields.newPassword && newPasswordValue.length > 0;
  const isConfirmPasswordValid =
    !errors.confirmPassword && dirtyFields.confirmPassword && confirmPasswordValue.length > 0;

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      setError(null);

      await authApi.resetPassword(email, otpCode, data.newPassword);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={`flex-1 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
      {/* HEADER */}
      <Box style={{ zIndex: 10 }}>
        <WelcomeCard
          primaryTitle="New"
          secondaryTitle="Password"
          contain="Choose a strong password for your account"
          showBackButton={true}
        />
      </Box>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <VStack
          className={`flex-1 px-8 pt-12 mt-20 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} rounded-t-[35px]`}
          style={{ zIndex: 20 }}
        >
          <Box className="mt-2">

            {/* ── New Password ── */}
            <FormControl isInvalid={!!errors.newPassword} className="mb-5">
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="New Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isInvalid={!!errors.newPassword}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                    leftIcon={
                      <Icons.LucideLock
                        className={`${isDark ? 'text-icons-800' : 'text-icons-200'}`}
                        size={18}
                        strokeWidth={1.8}
                      />
                    }
                    rightIcon={
                      isNewPasswordValid ? (
                        <CheckCircleIcon
                          size={20}
                          color="#10b981"
                          fill={isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => setShowNewPassword(!showNewPassword)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          {showNewPassword
                            ? <EyeIcon size={20} color={iconColor} />
                            : <EyeOffIcon size={20} color={iconColor} />
                          }
                        </TouchableOpacity>
                      )
                    }
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.newPassword?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* ── Confirm Password ── */}
            <FormControl isInvalid={!!errors.confirmPassword} className="mb-8">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isInvalid={!!errors.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    leftIcon={
                      <Icons.LucideLock
                        className={`${isDark ? 'text-icons-800' : 'text-icons-200'}`}
                        size={18}
                        strokeWidth={1.8}
                      />
                    }
                    rightIcon={
                      isConfirmPasswordValid ? (
                        <CheckCircleIcon
                          size={20}
                          color="#10b981"
                          fill={isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          {showConfirmPassword
                            ? <EyeIcon size={20} color={iconColor} />
                            : <EyeOffIcon size={20} color={iconColor} />
                          }
                        </TouchableOpacity>
                      )
                    }
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.confirmPassword?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* General error */}
            {error && (
              <Text className="text-red-500 text-xs ml-1 mb-4">
                {error}
              </Text>
            )}

            {/* ── Reset Button ── */}
            <Button
              size="xl"
              className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} h-16 rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98]`}
              isDisabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            >
              <HStack space="md" className="items-center justify-center">
                {isLoading && (
                  <ActivityIndicator
                    size="small"
                    color={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                  />
                )}
                <ButtonText className={`${isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-bold text-lg`}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </ButtonText>
              </HStack>
            </Button>

          </Box>
        </VStack>
      </KeyboardAvoidingView>
    </Box>
  );
}