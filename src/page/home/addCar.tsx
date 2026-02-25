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

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CAR_BRANDS = ["BMW", "Audi", "Mercedes", "Toyota", "Ford", "Tesla", "Honda", "Volkswagen"];

const insertCarSchema = z.object({
  selectedBrand: z.string().optional(),
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

  const { control, handleSubmit } = useForm<InsertCarFormData>({
      resolver: zodResolver(insertCarSchema),
      defaultValues: { selectedBrand: "", model: "", year: "", kilometers: "" },
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

  const onSave = (data: InsertCarFormData) => {
    console.log("Form data on submit:", data);
    try {
        setLoading(true);
        console.log("Saving car with data:", { ...data, brand: selectedBrand });
        console.log(data);
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
            <Text style={styles.label}>Brand</Text>
            <TouchableOpacity
              onPress={() => setShowBrandPicker(!showBrandPicker)}
              style={[
                styles.inputBase,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: selectedBrand ? "#2563eb" : "#e2e8f0",
                  marginBottom: showBrandPicker ? 6 : 16,
                },
              ]}
            >
              <Text style={{ color: selectedBrand ? "#0f172a" : "#94a3b8", fontSize: 15 }}>
                {selectedBrand ?? "Select brand..."}
              </Text>
              <Ionicons
                name={showBrandPicker ? "chevron-up" : "chevron-down"}
                size={16}
                color="#94a3b8"
              />
            </TouchableOpacity>

            {showBrandPicker && (
              <Box
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  overflow: "hidden",
                }}
              >
                {CAR_BRANDS.map((brand, i) => (
                  <TouchableOpacity
                    key={brand}
                    onPress={() => {
                      setSelectedBrand(brand);
                      setShowBrandPicker(false);
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 13,
                      backgroundColor: selectedBrand === brand ? "#eff6ff" : "transparent",
                      borderBottomWidth: i < CAR_BRANDS.length - 1 ? 1 : 0,
                      borderColor: "#f1f5f9",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: selectedBrand === brand ? "#2563eb" : "#374151",
                        fontSize: 14,
                        fontWeight: selectedBrand === brand ? "600" : "400",
                      }}
                    >
                      {brand}
                    </Text>
                    {selectedBrand === brand && (
                      <Ionicons name="checkmark" size={16} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                ))}
              </Box>
            )}

            {/* Model Input */}
            <FormControl className="mb-5">
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
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs">
                  {/* {errors.email?.message} */}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Year Input */}
            <FormControl className="mb-5">
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
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs">
                  {/* {errors.email?.message} */}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Kilometers Input */}
            <FormControl className="mb-5">
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
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs">
                  {/* {errors.email?.message} */}
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
  );
}

const styles = {
  label: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    marginBottom: 8,
  },
  inputBase: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
};