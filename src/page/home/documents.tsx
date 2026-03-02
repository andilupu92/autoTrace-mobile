import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function PremiumDocumentCard({
  name,
  daysRemaining,
  totalDays = 30,
}: {
  name: string;
  daysRemaining: number;
  totalDays?: number;
}) {
  const progress = 1 - daysRemaining / totalDays;

  const progressWidth = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 800 });

    if (daysRemaining <= 3) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 900 }),
          withTiming(1, { duration: 900 })
        ),
        -1,
        true
      );
    }
  }, []);

  const animatedProgress = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const getColors = () => {
    if (daysRemaining <= 3)
      return {
        text: "text-red-600",
        badgeBg: "bg-red-50",
        progress: "#DC2626",
      };

    if (daysRemaining <= 10)
      return {
        text: "text-amber-600",
        badgeBg: "bg-amber-50",
        progress: "#F59E0B",
      };

    return {
      text: "text-emerald-600",
      badgeBg: "bg-emerald-50",
      progress: "#10B981",
    };
  };

  const colors = getColors();

  return (
    <Animated.View style={[animatedPulse]} className="mb-4">
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 18,
        }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[15px] font-semibold text-gray-800">
            {name}
          </Text>

          <View className={`${colors.badgeBg} px-3 py-1 rounded-full`}>
            <Text className={`text-[12px] font-bold ${colors.text}`}>
              {daysRemaining} days
            </Text>
          </View>
        </View>

        {/* Progress Track */}
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <Animated.View
            style={[
              animatedProgress,
              {
                height: 8,
                backgroundColor: colors.progress,
                borderRadius: 999,
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}