import { useState } from "react";
import {
  TouchableOpacity,
  Platform,
  UIManager,
  ActivityIndicator,
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
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Controller, useForm } from "react-hook-form";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { carApi } from "@/src/api/services/carService";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CAR_BRANDS = [
  { label: 'Volkswagen', value: 'volkswagen' },
  { label: 'BMW', value: 'bmw' },
  { label: 'Toyota', value: 'toyota' },
];

const insertCarSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year must be at least 4 characters"),
  kilometers: z.string().min(1, "Kilometers is required"),
});

type InsertCarFormData = z.infer<typeof insertCarSchema>;

export default function AddCarCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showBrandPicker, setShowBrandPicker] = useState(false);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<InsertCarFormData>({
      resolver: zodResolver(insertCarSchema),
      defaultValues: { brand: "", model: "", year: "", kilometers: "" },
      mode: "onChange"
    });

  // Shared values for animations
  const rotation = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const formScale = useSharedValue(0.97);
  const iconOpacity = useSharedValue(0);

  const toggle = () => {
    const opening = !isOpen;

    rotation.value = withSpring(opening ? 1 : 0, { damping: 15, stiffness: 120 });
    iconOpacity.value = withTiming(opening ? 1 : 0, { duration: 200 });

    if (opening) {
      formOpacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.ease) });
      formScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    } else {
      formOpacity.value = withTiming(0, { duration: 180 });
      formScale.value = withSpring(0.97, { damping: 14, stiffness: 100 });
      setShowBrandPicker(false);
    }

    setIsOpen(opening);
  };

  // Animated styles
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(rotation.value, [0, 1], [0, 45])}deg`,
      },
    ],
    opacity: iconOpacity.value,
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ scale: formScale.value }],
  }));

  const onSave = async (data: InsertCarFormData) => {
    try {
        setLoading(true);

        const responseData = await carApi.register(data);

        toggle();
    } catch (error) {
        console.error("Error registering vehicle:", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box style={{ alignItems: "center", paddingHorizontal: 16, marginVertical: 12 }}>
      <Box
        style={{
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: isOpen ? "#ffffff" : "transparent",
          borderWidth: isOpen ? 0 : 1.5,
          borderColor: "#cbd5e1",
          borderStyle: "dashed",
          shadowColor: "#64748b",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isOpen ? 0.1 : 0,
          shadowRadius: 16,
          elevation: isOpen ? 3 : 0,
        }}
      >
        {/* Header Row — tappable */}
        <TouchableOpacity
          onPress={toggle}
          activeOpacity={0.85}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 16,
            minHeight: 64,
          }}
        >
          {/* Left: icon + text */}
          <Box style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Box
              className={`w-[38px] h-[38px] rounded-[12px] items-center justify-center ${
                    isOpen ? "bg-blue-50" : "bg-slate-100"
                }`}
            >
              <Ionicons
                name="car-sport-outline"
                size={20}
                color={isOpen ? "#2563eb" : "#64748b"}
              />
            </Box>

            <Box>
              <Text className="font-bold text-[15px] text-slate-900 tracking-[-0.3px]">
                {isOpen ? "New Vehicle" : "Add your car"}
              </Text>
              <Text style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
                {isOpen ? "Fill in the details below" : "Tap to register a vehicle"}
              </Text>
            </Box>
          </Box>

          {/* Animated rotate + icon — only visible when open */}
          <Animated.View
            style={[
              {
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: "#eff6ff",
                alignItems: "center",
                justifyContent: "center",
              },
              iconAnimatedStyle,
            ]}
          >
            <Ionicons name="add" size={20} color="#2563eb" />
          </Animated.View>
        </TouchableOpacity>

        {/* Expanded Form */}
        {isOpen && (
          <Animated.View
            style={[
              { paddingHorizontal: 20, paddingBottom: 24 },
              formAnimatedStyle,
            ]}
          >
            {/* Divider */}
            <Box style={{ height: 1, backgroundColor: "#f1f5f9", marginBottom: 20 }} />

            {/* Brand */}
            <FormControl className="mb-5" style={{ zIndex: 999 }} isInvalid={!!errors.brand}>
                <Controller
                    control={control}
                    name="brand"
                    render={({ field: { onChange, value } }) => (
                    <FloatingSelect
                        label="Brand"
                        value={value}
                        onValueChange={onChange}
                        options={CAR_BRANDS}
                        isInvalid={!!errors.brand}
                    />
                    )}
                />
                <FormControlError>
                    <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                        {errors.brand?.message}
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>

            {/* Model Input */}
            <FormControl className="mb-5" isInvalid={!!errors.model}>
              <Controller
                control={control}
                name="model"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Model"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="default"
                    autoCapitalize="none"
                    isInvalid={!!errors.model}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.model?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Year Input */}
            <FormControl className="mb-5" isInvalid={!!errors.year}>
              <Controller
                control={control}
                name="year"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Year"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    isInvalid={!!errors.year}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.year?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Kilometers Input */}
            <FormControl className="mb-5" isInvalid={!!errors.kilometers}>
              <Controller
                control={control}
                name="kilometers"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Kilometers"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    isInvalid={!!errors.kilometers}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.kilometers?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Register Button */}
            <Button 
              size="xl" 
              className="bg-black dark:bg-blue-600 h-16 rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98]" 
              isDisabled={isLoading}
              onPress={handleSubmit(onSave)}
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
                  {isLoading ? 'Registering...' : 'Register Vehicle'}
                </ButtonText>
              </HStack>
            </Button>

            {/* Cancel */}
            <TouchableOpacity onPress={toggle} style={{ alignItems: "center", paddingTop: 14 }}>
              <Text style={{ color: "#94a3b8", fontSize: 13 }}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Box>
    </Box>
  )
}