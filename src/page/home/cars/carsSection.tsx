import {
  Platform,
  View,
  Dimensions,
  Text,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Path, Svg } from "react-native-svg";
import { useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import Car from "./car";
import HeaderSection from "@/src/utils/headerSection";

type CarsSectionProps = {
  onAddCar: () => void;
};

const { width } = Dimensions.get("window");
const WHITE_CARD_HEIGHT = 160;
const SWIPE_THRESHOLD = 50;

type CarItem = {
  id: string;
  name: string;
  km: string;
};

const INITIAL_CARS: CarItem[] = [
  { id: "1", name: "BMW X6",     km: "321.000 KM" },
  { id: "2", name: "Audi A5",    km: "120.000 KM" },
  { id: "3", name: "Dacia 1300", km: "400.000 KM" },
];

export default function CarsSection({ onAddCar }: CarsSectionProps) {
  const [cars, setCars]                 = useState<CarItem[]>(INITIAL_CARS);
  const [currentIndex, setCurrentIndex] = useState(1);
  const translateX = useSharedValue(0);
  const [editingData, setEditingData] = useState<{ 
    brand: string; model: string; kilometers: string; year: number } | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const total = cars.length;

  const getVisibleCars = (index: number) => {
    if (total === 0) return [null, null, null];
    const prev = (index - 1 + total) % total;
    const next = (index + 1) % total;
    return [cars[prev], cars[index], cars[next]];
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
    .activeOffsetX([-15, 15])
    .onUpdate((e) => { translateX.value = e.translationX; })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(animateSwipe)("left", (currentIndex + 1) % total);
      } else if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(animateSwipe)("right", (currentIndex - 1 + total) % total);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleAdd = () => {
    const newCar: CarItem = {
      id: Date.now().toString(),
      name: "New Car",
      km: "0 KM",
    };
    const updated = [...cars, newCar];
    setCars(updated);
    setCurrentIndex(updated.length - 1);
  };

  const handleEdit = () => {
    console.log("Edit:", cars[currentIndex]);
  };

  const handleDelete = () => {
    if (total <= 1) return;
    const updated = cars.filter((_, i) => i !== currentIndex);
    setCars(updated);
    setCurrentIndex((prev) => Math.min(prev, updated.length - 1));
  };

  const [prevCar, currentCar, nextCar] = getVisibleCars(currentIndex);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width, height: WHITE_CARD_HEIGHT + 20 }} className="px-6">

        {/* ── White curved card ── */}
        <View
          className="absolute"
          style={{
            marginTop: -40,
            zIndex: -1,
            width,
            ...Platform.select({
              ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 10 },
              android: { elevation: 8 },
            }),
          }}
        >
          <Svg width={width} height={WHITE_CARD_HEIGHT} viewBox={`0 0 ${width} ${WHITE_CARD_HEIGHT}`}>
            <Path
              d={`M0 0 H${width} V${WHITE_CARD_HEIGHT - 40} Q${width / 2} ${WHITE_CARD_HEIGHT + 40} 0 ${WHITE_CARD_HEIGHT - 40} Z`}
              fill="#ffffff"
            />
          </Svg>
        </View>
        
        <View className="mt-5">
          <HeaderSection 
              name="My Cars"
              onAdd={onAddCar}
          />
        </View>
        <View>
          <Text className="text-gray-500 text-sm text-center">
            You have <Text className="font-bold text-green-500">{total}</Text> {total === 1 ? "car" : "cars"} in your garage.
          </Text>
        </View>

        {/* ── Cars carousel ── */}
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[animatedStyle, { marginTop: 20 }]}
            className="flex-row justify-between px-6"
          >
            {prevCar    && <Car name={prevCar.name}    km={prevCar.km} />}
            {currentCar && <Car name={currentCar.name} km={currentCar.km} highlight />}
            {nextCar    && <Car name={nextCar.name}    km={nextCar.km} />}
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}