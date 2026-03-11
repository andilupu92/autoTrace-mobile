import { useState } from "react";
import {
  Platform,
  UIManager,
  Dimensions,
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
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
import { Ionicons } from "@expo/vector-icons";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Controller, useForm } from "react-hook-form";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { carApi } from "../../../api/services/carService";
import { useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  isVisible: boolean;
  onClose: () => void;
  initialData?: { brand: string; model: string; kilometers: string, year: number } | null;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.52;
const DRAG_CLOSE_THRESHOLD = SHEET_HEIGHT * 0.28;
const CAR_BRANDS = [
  { label: 'Volkswagen', value: 'volkswagen' },
  { label: 'BMW', value: 'bmw' },
  { label: 'Toyota', value: 'toyota' },
];

const insertCarSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1886, "Year must be 1886 or later").max(new Date().getFullYear() + 1, `Year cannot be in the future`),
  kilometers: z.coerce.number().min(0, "Kilometers cannot be negative"),
});

type InsertCarFormData = z.input<typeof insertCarSchema>;

export default function AddCar({ isVisible, onClose, initialData }: Props) {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const dragContext = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<InsertCarFormData>({
      resolver: zodResolver(insertCarSchema),
      defaultValues: { brand: "", model: "", year: 0, kilometers: 0 },
      mode: "onChange"
  });

  // Shared values for animations
  const rotation = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const formScale = useSharedValue(0.97);
  const iconOpacity = useSharedValue(0);

  const onSave = async (data: InsertCarFormData) => {
    try {
        setLoading(true);

        const responseData = await carApi.register(data);

        console.log("Vehicle registered successfully:", responseData);

    } catch (error) {
        console.error("Error registering vehicle:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      if (isVisible && initialData) {
        setValue("brand", initialData.brand);
        setValue("model", initialData.model);
        setValue("year", initialData.year);
        setValue("kilometers", initialData.kilometers);
      }
    }, [isVisible]);

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
          } else {
            translateY.value = withSpring(SHEET_HEIGHT, {
              damping: 20,
              stiffness: 200,
            });
            backdropOpacity.value = withTiming(0, { duration: 280 });
          }
        }
      );
    
      const closeSheet = () => {
        translateY.value = withSpring(
          SHEET_HEIGHT,
          { damping: 20, stiffness: 200 },
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