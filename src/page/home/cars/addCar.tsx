import { useState } from "react";
import {
  Platform,
  UIManager,
  Dimensions,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
} from "react-native-reanimated";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Controller, useForm } from "react-hook-form";
import { FloatingInput } from "@/components/ui/floating-input";
import { useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  isVisible: boolean;
  onClose: () => void;
  initialData?: { brand: string; model: string; year: number; kilometers: number } | null;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.63;
const DRAG_CLOSE_THRESHOLD = SHEET_HEIGHT * 0.28;

const insertCarSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  kilometers: z.coerce.number().min(1, "Kilometers is required"),
  year: z.coerce.number().min(1886, "Year must be 1886 or later").max(new Date().getFullYear() + 1, `Year cannot be in the future`),
});

type InsertCarFormData = z.input<typeof insertCarSchema>;

export default function AddCar({ isVisible, onClose, initialData }: Props) {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const dragContext = useSharedValue(0);
  const [isLoading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<InsertCarFormData>({
      resolver: zodResolver(insertCarSchema),
      defaultValues: {
        brand: initialData?.brand ?? '',
        model: initialData?.model ?? '',
        kilometers: initialData?.kilometers ?? '',
        year: initialData?.year ?? '',
    },
      mode: "onChange"
  });

  const onSubmit = async (data: InsertCarFormData) => {
      try {
        console.log("Attempting car save...");
        setLoading(true);
  
        console.log("Car save Success for: ", data.brand);
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message 
          || error?.message 
          || 'An error occurred during car save';
        console.error('Car save error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      if (isVisible && initialData) {
        reset({
            brand: initialData.brand,
            model: initialData.model,
            kilometers: initialData.kilometers,
            year: initialData.year,
        });
      }
    }, [isVisible, initialData]);

    useAnimatedReaction(
        () => isVisible,
        (visible) => {
          if (visible) {
            translateY.value = withSpring(0, {
              damping: 22,
              stiffness: 160,
              mass: 0.8,
            });
            backdropOpacity.value = withTiming(1, { duration: 320 });
          }
        }
      );
    
      const closeSheet = () => {
        translateY.value = withTiming(
          SHEET_HEIGHT,
          { duration: 280 },
          (finished) => {
            if (finished) runOnJS(onClose)();
          }
        );
        backdropOpacity.value = withTiming(0, { duration: 280 });
      };
    
      // Gesture de drag (swipe down pentru dismiss)
      const panGesture = Gesture.Pan()
        .onStart(() => {
          dragContext.value = translateY.value;
        })
        .onUpdate((event) => {
          const newY = dragContext.value + event.translationY;
          translateY.value = Math.max(0, newY);
    
          backdropOpacity.value = interpolate(
            translateY.value,
            [0, SHEET_HEIGHT],
            [1, 0],
            Extrapolation.CLAMP
          );
        })
        .onEnd((event) => {
          if (
            event.translationY > DRAG_CLOSE_THRESHOLD ||
            event.velocityY > 500
          ) {
            runOnJS(closeSheet)();
          } else {
            translateY.value = withSpring(0, { damping: 22, stiffness: 160 });
            backdropOpacity.value = withTiming(1, { duration: 200 });
          }
        });
    
      const animatedSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
      }));
    
      const animatedBackdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
      }));
    
      if (!isVisible) return null;

  return (
    <>
    {/* Blur backdrop */}
          <Animated.View
            style={[StyleSheet.absoluteFillObject, animatedBackdropStyle]}
            pointerEvents="auto"
          >
            <BlurView
              intensity={Platform.OS === "ios" ? 30 : 15}
              tint="light"
              style={StyleSheet.absoluteFillObject}
              experimentalBlurMethod="dimezisBlurView"
            >
              <Pressable
                style={StyleSheet.absoluteFillObject}
                onPress={closeSheet}
              />
            </BlurView>
          </Animated.View>
    
          {/* Bottom Sheet */}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[styles.sheet, animatedSheetStyle]}
              className="bg-white"
            >
              {/* Handle indicator */}
              <View className="items-center pt-3 pb-1">
                <View className="w-10 h-[5px] bg-gray-200 rounded-full" />
              </View>
    
              {/* Header */}
              <View className="flex-row items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
                <Text className="text-base font-semibold text-gray-900">
                  {isEditing ? "Edit Car" : "Add Car"}
                </Text>
                <Pressable
                  onPress={closeSheet}
                  className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
                >
                  <Text className="text-gray-500 text-sm font-medium">✕</Text>
                </Pressable>
              </View>

              {/* Conținut */}
              <View className="flex-1 px-5 pt-6 gap-5">

                {/* --- BRAND --- */}
                <FormControl isInvalid={!!errors.brand}>
                  <Controller
                    control={control}
                    name="brand"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <FloatingInput
                        label="Brand"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        isInvalid={!!errors.brand}
                        autoCapitalize="words"
                      />
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                      {errors.brand?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                {/* --- MODEL --- */}
                <FormControl isInvalid={!!errors.model}>
                  <Controller
                    control={control}
                    name="model"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <FloatingInput
                        label="Model"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        isInvalid={!!errors.model}
                        autoCapitalize="words"
                      />
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                      {errors.model?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                {/* --- KILOMETERS --- */}
                <FormControl isInvalid={!!errors.kilometers}>
                  <Controller
                    control={control}
                    name="kilometers"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <FloatingInput
                        label="Kilometers"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        isInvalid={!!errors.kilometers}
                        autoCapitalize="words"
                      />
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                      {errors.kilometers?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                {/* --- YEAR --- */}
                <FormControl isInvalid={!!errors.year}>
                  <Controller
                    control={control}
                    name="year"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <FloatingInput
                        label="Year"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        isInvalid={!!errors.year}
                        autoCapitalize="words"
                      />
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                      {errors.year?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                {/* Save Button */}
                <View className="px-5 pb-8 pt-4">
                  <Button
                    size="xl"
                    className="bg-black dark:bg-blue-600 h-16 rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98]"
                    isDisabled={isLoading}
                    onPress={handleSubmit(onSubmit)}
                  >
                    <HStack space="md" className="items-center justify-center">
                      {isLoading ? (
                        <ActivityIndicator
                          size="small"
                          color={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                          className="text-white dark:text-blue-400 mr-2"
                        />
                      ) : null}
                        <ButtonText className="font-bold dark:text-white text-lg">
                          {isLoading ? 'Se salvează...' : isEditing ? 'Update' : 'Save'}
                        </ButtonText>
                      </HStack>
                    </Button>
                </View>
            
              </View>
        </Animated.View>
      </GestureDetector>
    </>
  )
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 24,
  },
  ctaShadow: {
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
});