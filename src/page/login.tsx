import { useState } from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
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
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import WelcomeCard from "./WelcomeCard";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();

  const { control, handleSubmit, formState: { errors, dirtyFields }, watch } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange"
  });

  const emailValue = watch("email");
  const isEmailValid = !errors.email && dirtyFields.email && emailValue.length > 0;

  const onSubmit = (data: LoginFormData) => {
    console.log("Login with email:", data.email);
  };

  const iconColor = colorScheme === 'dark' ? '#94a3b8' : '#9ca3af';
  const activeIconColor = '#10b981';

  return (
    <Box className="flex-1 bg-white dark:bg-slate-950">
      
      {/* HEADER */}
      <Box style={{ zIndex: 10 }}>
        <WelcomeCard />
      </Box>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >

        <VStack 
          className="flex-1 px-8 pt-12 mt-12 bg-white dark:bg-slate-950 rounded-t-[35px]"
          style={{ zIndex: 20 }}
        >
          
          <Box className="mt-2">
            
            {/* --- EMAIL INPUT --- */}
            <FormControl isInvalid={!!errors.email} className="mb-5">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Box className={`
                    bg-gray-50 dark:bg-slate-900 
                    border ${errors.email ? 'border-red-400' : isEmailValid ? 'border-green-400' : 'border-gray-100 dark:border-slate-800'} 
                    rounded-2xl px-4 py-3
                  `}>
                    <Text className="text-xs text-gray-400 dark:text-slate-500 font-medium ml-1 mb-0.5">
                      Email or Mobile number
                    </Text>
                    
                    <HStack className="items-center justify-between">
                      <Input className="h-7 flex-1 p-0 border-0 border-transparent">
                        <InputField
                          className="font-bold text-base text-gray-800 dark:text-white p-0 leading-tight"
                          placeholder="john@example.com"
                          placeholderTextColor={colorScheme === 'dark' ? '#334155' : '#e2e8f0'}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </Input>
                      
                      {isEmailValid && (
                        <CheckCircleIcon size={20} color={activeIconColor} fill={colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'} />
                      )}
                    </HStack>
                  </Box>
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs">
                  {errors.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* --- PASSWORD INPUT --- */}
            <FormControl isInvalid={!!errors.password} className="mb-2">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Box className={`
                    bg-gray-50 dark:bg-slate-900 
                    border ${errors.password ? 'border-red-400' : 'border-gray-100 dark:border-slate-800'} 
                    rounded-2xl px-4 py-3
                  `}>
                    <Text className="text-xs text-gray-400 dark:text-slate-500 font-medium ml-1 mb-0.5">
                      Password
                    </Text>

                    <HStack className="items-center justify-between">
                      <Input className="h-7 flex-1 p-0 border-0 border-transparent">
                        <InputField
                          className="font-bold text-base text-gray-800 dark:text-white p-0 leading-tight"
                          placeholder="••••••••"
                          placeholderTextColor={colorScheme === 'dark' ? '#334155' : '#e2e8f0'}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          secureTextEntry={!showPassword}
                        />
                      </Input>

                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <EyeOffIcon color={iconColor} size={20} />
                        ) : (
                          <EyeIcon color={iconColor} size={20} />
                        )}
                      </TouchableOpacity>
                    </HStack>
                  </Box>
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs">
                  {errors.password?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Forgot Password Link */}
            <Box className="items-end mb-8 mr-1"> 
              <Link>
                <LinkText className="text-sm text-blue-500 dark:text-blue-400 font-medium no-underline">
                  Forgot your password?
                </LinkText>
              </Link>
            </Box>

            {/* Sign In Button */}
            <Button 
              size="xl" 
              className="bg-black dark:bg-white h-16 rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98]" 
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText className="font-bold text-white dark:text-black text-lg">
                Sign In
              </ButtonText>
            </Button>

            <HStack className="items-center my-8">
              <Box className="flex-1 h-[1px] bg-gray-200 dark:bg-slate-800" />
                <Text className="px-4 text-gray-400 dark:text-slate-500 text-sm font-medium">
                  or continue with
                </Text>
              <Box className="flex-1 h-[1px] bg-gray-200 dark:bg-slate-800" />
            </HStack>

            {/* Social Login Buttons Container */}
            <HStack className="justify-center mt-6" space="lg">
              
              {/* Google Button */}
              <TouchableOpacity 
                className="w-16 h-16 items-center justify-center border border-gray-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 shadow-sm"
                onPress={() => console.log('Google')}
              >
                <AntDesign name="google" size={28} color="#EB4335" /> 
              </TouchableOpacity>

              {/* Facebook Button */}
              <TouchableOpacity 
                className="w-16 h-16 items-center justify-center border border-gray-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 shadow-sm"
                onPress={() => console.log('Facebook')}
              >
                <FontAwesome name="facebook" size={28} color="#1877F2" />
              </TouchableOpacity>

              {/* Apple Button - Condiționat pentru iOS 
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  className="w-16 h-16 items-center justify-center border border-gray-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 shadow-sm"
                  onPress={() => console.log('Apple')}
                >
                  <AntDesign 
                    name="apple1" 
                    size={28} 
                    color={useColorScheme().colorScheme === 'dark' ? 'white' : 'black'} 
                  />
                </TouchableOpacity>
              )}*/}
            </HStack>

            {/* Footer Links */}
            <HStack className="justify-center mt-8 items-center" space="xs">
              <Text className="text-gray-500 dark:text-slate-500 font-medium">
                Don't have an account?
              </Text>
              <Link>
                <LinkText className="text-blue-600 dark:text-blue-400 font-bold no-underline">
                  Sign up
                </LinkText>
              </Link>
            </HStack>
            
          </Box>
        </VStack>
      </KeyboardAvoidingView>
    </Box>
  );
}