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
  onEditCar: (data: { id: number; brandId: number; brandName: string; modelId: number; modelName: string; kilometers: number; year: number }) => void;
  onCarChange?: (logoUrl: string, id: number) => void;
};

const { width } = Dimensions.get("window");
const CONTAINER_WIDTH = width - 160;
const WHITE_CARD_HEIGHT = 160;
const SWIPE_THRESHOLD = 50;

type CarItem = {
  id: number;
  brandId: number;
  brandName: string;
  logoUrl: string;
  modelId: number;
  modelName: string;
  kilometers: number;
  year: number;
};

export default function CarsSection({ onAddCar, onEditCar, onCarChange }: CarsSectionProps) {
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

  useEffect(() => {
    if (cars.length > 0) {
      onCarChange?.(cars[0].logoUrl, cars[0].id);
    }
  }, [cars]);

  useEffect(() => {
    if (cars.length > 0) {
      onCarChange?.(cars[currentIndex].logoUrl, cars[currentIndex].id);
    }
  }, [currentIndex]);

  const total = cars.length;

  const animateSwipe = (direction: "left" | "right", nextIndex: number) => {
    const toValue = direction === "left" ? -CONTAINER_WIDTH : CONTAINER_WIDTH;
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

  const currentCarStyle = useAnimatedStyle(() => {
    const tx = translateX.value;
    const curveY = -160 * (tx / width) * (tx / width);
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: curveY },
      ],
    };
  });

  const nextCarStyle = useAnimatedStyle(() => {
    const tx = translateX.value + CONTAINER_WIDTH;
    const curveY = -160 * (tx / width) * (tx / width);
    return {
      transform: [
        { translateX: translateX.value + CONTAINER_WIDTH },
        { translateY: curveY },
      ],
      opacity: translateX.value < 0 ? 1 : 0,
    };
  });

  const prevCarStyle = useAnimatedStyle(() => {
    const tx = translateX.value - CONTAINER_WIDTH;
    const curveY = -160 * (tx / width) * (tx / width);
    return {
      transform: [
        { translateX: translateX.value - CONTAINER_WIDTH },
        { translateY: curveY },
      ],
      opacity: translateX.value > 0 ? 1 : 0,
    };
  });

  const leftArrowStyle = useAnimatedStyle(() => {
    const isActive = translateX.value < 0;
    const progress = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1);
    
    return {
      transform: [{ scale: isActive ? 1 + progress * 0.5 : 1 }],
      opacity: isActive ? 0.4 + progress * 0.6 : 0.4,
    };
  });

  const rightArrowStyle = useAnimatedStyle(() => {
    const isActive = translateX.value > 0;
    const progress = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1);

    return {
      transform: [{ scale: isActive ? 1 + progress * 0.5 : 1 }],
      opacity: isActive ? 0.4 + progress * 0.6 : 0.4,
    };
  });

  const handleEdit = () => {
    const car = cars[currentIndex];
    onEditCar({
      id: car.id,
      brandId: car.brandId,
      brandName: car.brandName,
      modelId: car.modelId,
      modelName: car.modelName,
      kilometers: car.kilometers,
      year: car.year,
    });
  };

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

        <View style={{ marginTop: 35 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8 }}>
            
            <Animated.Text style={[leftArrowStyle, { 
              color: "#F97316", fontSize: 40, fontWeight: "300", 
              width: 24, textAlign: "center",
              opacity: total >= 2 ? undefined : 0  
            }]}>‹</Animated.Text>

            {(() => {
              const nextIndex = (currentIndex + 1) % total;
              const prevIndex = (currentIndex - 1 + total) % total;
              const currentCar = total > 0 ? cars[currentIndex] : null;
              const nextCar = total >= 2 ? cars[nextIndex] : null;
              const prevCar = total >= 2 ? cars[prevIndex] : null;

              return (
                <GestureDetector gesture={pan}>
                  <View style={{ flex: 1, height: 120 }}>
                    
                    {prevCar && (
                      <Animated.View style={[prevCarStyle, { position: "absolute", width: "100%", alignItems: "center" }]}>
                        <Car name={prevCar.brandName + " " + prevCar.modelName} km={prevCar.kilometers} onEdit={handleEdit} />
                      </Animated.View>
                    )}

                    {currentCar && (
                      <Animated.View style={[currentCarStyle, { position: "absolute", width: "100%", alignItems: "center" }]}>
                        <Car name={currentCar.brandName + " " + currentCar.modelName} km={currentCar.kilometers} onEdit={handleEdit} />
                      </Animated.View>
                    )}

                    {nextCar && (
                      <Animated.View style={[nextCarStyle, { position: "absolute", width: "100%", alignItems: "center" }]}>
                        <Car name={nextCar.brandName + " " + nextCar.modelName} km={nextCar.kilometers} onEdit={handleEdit} />
                      </Animated.View>
                    )}

                  </View>
                </GestureDetector>
              );
            })()}

            <Animated.Text style={[rightArrowStyle, { 
              color: "#F97316", fontSize: 40, fontWeight: "300", 
              width: 24, textAlign: "center",
              opacity: total >= 2 ? undefined : 0  
            }]}>›</Animated.Text>
            
          </View>
        </View>
      </View>
    </View>
  );
}