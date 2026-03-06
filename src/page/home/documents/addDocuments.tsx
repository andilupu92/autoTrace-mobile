import {
  View,
  Text,
  Pressable,
  Dimensions,
  StyleSheet,
  Platform,
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
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.52;
const DRAG_CLOSE_THRESHOLD = SHEET_HEIGHT * 0.28;

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function AddDocuments({ isVisible, onClose }: Props) {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const dragContext = useSharedValue(0);

  // Reacționează la schimbarea prop-ului isVisible
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
              Add Document
            </Text>
            <Pressable
              onPress={closeSheet}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            >
              <Text className="text-gray-500 text-sm font-medium">✕</Text>
            </Pressable>
          </View>

          {/* Conținut */}
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-2xl font-bold text-gray-800 tracking-tight">
              Hello backdrop
            </Text>
            <Text className="text-sm text-gray-400 mt-2">
              Trage în jos sau apasă în afară pentru a închide
            </Text>
          </View>

          {/* CTA Button */}
          <View className="px-5 pb-8 pt-4">
            <Pressable
              onPress={closeSheet}
              className="bg-orange-500 active:bg-orange-600 rounded-2xl py-4 items-center"
              style={styles.ctaShadow}
            >
              <Text className="text-white font-semibold text-base">
                Confirm
              </Text>
            </Pressable>
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