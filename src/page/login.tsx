import { useState } from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useColorScheme } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Link, LinkText } from '@/components/ui/link';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { 
  FormControl,
  FormControlError, 
  FormControlErrorText
} from '@/components/ui/form-control';
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import WelcomeCard from "./WelcomeCard";


const loginSchema = z.object({
  email: z.string().min(1, "Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {

  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Login with email:", data.email);
  };

  return (
    <Box className="flex-1 bg-#F0F2F5 dark:bg-slate-950">
      <WelcomeCard />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >

        <Box className="flex-1 justify-center px-6">

          {/* Email Input Field */}
          <FormControl isInvalid={!!errors.email} className="mb-6">

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input size="md" className="dark:border-slate-700 dark:bg-slate-900">
                  <InputField
                    className="dark:text-white"
                    placeholder="Email"
                    placeholderTextColor={colorScheme === 'dark' ? '#64748b' : '#9CA3AF'}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />

            <FormControlError>
              <FormControlErrorText>
                {errors.email?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Password FormControl */}
          <FormControl isInvalid={!!errors.password} className="mb-6">

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input size="md" className="relative dark:border-slate-700 dark:bg-slate-900">
                  <InputField
                    className="dark:text-white"
                    placeholder="Password"
                    placeholderTextColor={colorScheme === 'dark' ? '#64748b' : '#9CA3AF'}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                  />
                  {/* 👁️ Eye icon toggle */}
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40"
                    >
                    {showPassword ? (
                      <EyeOffIcon color={colorScheme === 'dark' ? "white" : "black"} size={20} />
                    ) : (
                      <EyeIcon color={colorScheme === 'dark' ? "white" : "black"} size={20} />
                    )}
                  </TouchableOpacity>
                </Input>
              )}
            />

            <FormControlError>
              <FormControlErrorText>
                {errors.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Box className="mt-2 mb-6 items-center"> 
            <Link>
              <LinkText className="text-sm text-blue-600 dark:text-slate-400 no-underline font-medium">
                Forgot your password?
              </LinkText>
            </Link>
          </Box>

          {/* Login Button */}
          <Button 
            size="lg" 
            className="bg-blue-600 h-14 rounded-lg active:bg-blue-700" 
            onPress={handleSubmit(onSubmit)}
          >
            <ButtonText className="font-semibold text-white">Sign In</ButtonText>
          </Button>

          {/* Footer Links */}
          <VStack className="mt-8" space="lg" reversed={false}>
            

            <HStack className="justify-center" space="xs">
              <Text size="sm" className="text-gray-600 dark:text-slate-400">
                Don't have an account?
              </Text>
              <Link>
                <LinkText className="text-sm text-blue-600 dark:text-blue-400 font-medium no-underline">
                  Sign up
                </LinkText>
              </Link>
            </HStack>
          </VStack>

        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}