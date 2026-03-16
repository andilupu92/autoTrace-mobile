import { Animated, View } from "react-native";
import { useEffect, useRef } from "react";

export default function AnimatedProgressBar({
  pct,
  color,
}: {
  pct: number;
  color: string;
}) {
  const widthAnim = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [pct]);
 
  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });
 
  return (
    <View className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <Animated.View
        style={{ width: widthInterpolated, backgroundColor: color }}
        className="h-full rounded-full"
      />
    </View>
  );
}