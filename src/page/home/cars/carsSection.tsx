import {
  Platform,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Path, Svg } from "react-native-svg";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import Car from "./car";
import HeaderSection from "@/src/utils/headerSection";
import { carApi } from "@/src/api/services/carService";

type CarsSectionProps = {
  onAddCar: () => void;
  onEditCar: (data: { brand: string; model: string; kilometers: number;year: number }) => void;
};

const { width } = Dimensions.get("window");
const WHITE_CARD_HEIGHT = 160;
const SWIPE_THRESHOLD = 50;

type CarItem = {
  brand: string;
  model: string;
  kilometers: number;
  year: number;
};

export default function CarsSection({ onAddCar, onEditCar }: CarsSectionProps) {
  const [loading, setLoading] = useState(false);
  const [cars, setCars]                 = useState<CarItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const responseData = await carApi.cars();
        setCars(responseData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
        fetchCars();
  }, []);

  const total = cars.length;

  const getVisibleCars = (index: number) => {
    if (total === 0) return [null, null, null];
    if (total === 1) return [null, cars[0], null];
    if (total === 2) return [null, cars[index], null];

    const prevIndex = (index - 1 + total) % total;
    const nextIndex = (index + 1) % total;
    return [cars[prevIndex], cars[index], cars[nextIndex]];
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

  const handleEdit = () => {
    const car = cars[currentIndex];
    onEditCar({
      brand: car.brand,
      model: car.model,
      kilometers: car.kilometers,
      year: car.year,
    });
  };

  const [prevCar, currentCar, nextCar] = getVisibleCars(currentIndex);
  if (loading) return <ActivityIndicator />;
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
          <Text className="text-gray-500 text-md text-center">
            You have <Text className="font-bold text-green-500">{total}</Text> {total === 1 ? "car" : "cars"} in your garage.
          </Text>
        </View>

        {/* ── Cars carousel ── */}
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[animatedStyle, { marginTop: 20 }]}
            className={`flex-row px-6 ${
              (total === 1 || total === 2) ? "justify-center" : "justify-between"
            }`}
          >
            {prevCar    && <Car name={prevCar.brand}    km={prevCar.kilometers} />}
            {currentCar && <Car name={currentCar.brand} km={currentCar.kilometers} highlight onEdit={handleEdit}/>}
            {nextCar    && <Car name={nextCar.brand}    km={nextCar.kilometers} />}
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}