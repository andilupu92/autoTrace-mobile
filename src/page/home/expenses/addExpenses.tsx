import {
  View,
  Pressable,
  Dimensions,
  StyleSheet,
  Platform,
  ActivityIndicator
} from "react-native";
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
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import FloatingInput from '@/components/ui/floating-input';
import { 
  FormControl,
  FormControlError, 
  FormControlErrorText
} from '@/components/ui/form-control';
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDaysIcon } from "lucide-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.52;
const DRAG_CLOSE_THRESHOLD = SHEET_HEIGHT * 0.28;

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const documentSchema = z.object({
  category: z
    .string()
    .min(1, 'Category is required'),
  expenseName: z
    .string()
    .min(1, 'Expense name is required'),
  sum: z
    .number({ message: 'Sum must be a number' })
    .positive('Sum must be greater than zero'),
  date: z
    .date({ message: 'Data este obligatorie' }),
});

type ExpensesFormData = z.infer<typeof documentSchema>;

export default function AddExpenses({ isVisible, onClose }: Props) {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const dragContext = useSharedValue(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ExpensesFormData>({
    resolver: zodResolver(documentSchema),
  });

  const onSubmit = async (data: ExpensesFormData) => {
      try {
        console.log("Attempting expense save...");
        setLoading(true);
  
  
        console.log("Expense save Success for: ", data.expenseName);
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message 
          || error?.message 
          || 'An error occurred during expense save';
        console.error('Expense save error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              {"Add Expense"}
            </Text>
            <Pressable
              onPress={closeSheet}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            >
              <Text className="text-gray-500 text-sm font-medium">✕</Text>
            </Pressable>
          </View>

          {/* CONTAINS */}
          <View className="flex-1 px-5 pt-6 gap-5">

            {/* --- NUME CATEGORIE --- */}
            <FormControl isInvalid={!!errors.category}>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Category name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isInvalid={!!errors.category}
                    autoCapitalize="words"
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.category?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* --- NUME EXPENSE --- */}
            <FormControl isInvalid={!!errors.expenseName}>
              <Controller
                control={control}
                name="expenseName"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Expense name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isInvalid={!!errors.expenseName}
                    autoCapitalize="words"
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.expenseName?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* --- SUM --- */}
            <FormControl isInvalid={!!errors.sum}>
              <Controller
                control={control}
                name="sum"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Sum"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isInvalid={!!errors.sum}
                    autoCapitalize="words"
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.sum?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* --- DATA EXPIRARE --- */}
            <FormControl isInvalid={!!errors.date}>
              <Controller
                control={control}
                name="date"
                render={({ field: { value } }) => (
                  <>
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      className={`border rounded-2xl px-4 py-3.5 bg-gray-50 flex-row items-center justify-between
                        ${errors.date ? 'border-red-500' : 'border-gray-200'}`}
                    >
                      <Text className={value ? 'text-base text-gray-900' : 'text-base text-gray-400'}>
                        {value
                          ? value.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          : 'Data expirare'}
                      </Text>
                      <CalendarDaysIcon
                        size={20}
                        color={errors.date ? '#ef4444' : '#9ca3af'}
                      />
                    </Pressable>

                    {showDatePicker && (
                      <DateTimePicker
                        value={value ?? new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        minimumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(Platform.OS === 'ios');
                          if (selectedDate) {
                            setValue('date', selectedDate, { shouldValidate: true });
                          }
                        }}
                      />
                    )}
                  </>
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.date?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

          </View>

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
                  {isLoading ? 'Se salvează...' : 'Save'}
                </ButtonText>
              </HStack>
            </Button>
          </View>

        </Animated.View>
      </GestureDetector>
    </>
  );
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