import { Platform, View, Dimensions } from "react-native";
import { Path, Svg } from "react-native-svg";
import { useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Car from "./car";

const { width } = Dimensions.get("window");
const WHITE_CARD_HEIGHT = 160;
const SWIPE_THRESHOLD = 50;

const ALL_CARS = [
  { name: "BMW X6",     km: "321.000 KM" },
  { name: "Audi A5",    km: "120.000 KM" },
  { name: "Dacia 1300", km: "400.000 KM" },
];

export default function CarsSection() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const translateX = useSharedValue(0);

  const getVisibleCars = (index: number) => {
    const total = ALL_CARS.length;
    const prev  = (index - 1 + total) % total;
    const next  = (index + 1) % total;
    return [ALL_CARS[prev], ALL_CARS[index], ALL_CARS[next]];
  };

  const animateSwipe = (direction: "left" | "right", nextIndex: number) => {
    const toValue = direction === "left" ? -width : width;

    translateX.value = withTiming(toValue, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setCurrentIndex)(nextIndex);
        translateX.value = 0;
      }
    });
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const total = ALL_CARS.length;

      if (e.translationX < -SWIPE_THRESHOLD) {
        // Swipe LEFT → next car
        const next = (currentIndex + 1) % total;
        runOnJS(animateSwipe)("left", next);
      } else if (e.translationX > SWIPE_THRESHOLD) {
        // Swipe RIGHT → prev car
        const prev = (currentIndex - 1 + total) % total;
        runOnJS(animateSwipe)("right", prev);
      } else {
        // Snap back
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const [prevCar, currentCar, nextCar] = getVisibleCars(currentIndex);

  return (
    <View style={{ height: WHITE_CARD_HEIGHT + 20, width }}>

      {/* 1. White card */}
      <View
        className="absolute"
        style={{
          marginTop: -80,
          zIndex: -1,
          width,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            android: { elevation: 8 },
          }),
        }}
      >
        <Svg
          width={width}
          height={WHITE_CARD_HEIGHT}
          viewBox={`0 0 ${width} ${WHITE_CARD_HEIGHT}`}
        >
          <Path
            d={`M0 0 H${width} V${WHITE_CARD_HEIGHT - 40} Q${width / 2} ${WHITE_CARD_HEIGHT + 40} 0 ${WHITE_CARD_HEIGHT - 40} Z`}
            fill="#ffffff"
          />
        </Svg>
      </View>

      {/* 2. Cars carousel */}
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[animatedStyle, { marginTop: 40 }]}
          className="flex-row justify-between px-6"
        >
          <Car name={prevCar.name}    km={prevCar.km} />
          <Car name={currentCar.name} km={currentCar.km} highlight />
          <Car name={nextCar.name}    km={nextCar.km} />
        </Animated.View>
      </GestureDetector>

    </View>
  );
}