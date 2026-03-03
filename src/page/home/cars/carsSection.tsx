import { Platform, View, Dimensions } from "react-native";
import StatBubble from "./statBubble";
import { Path, Svg } from "react-native-svg";
import { Image } from "@gluestack-ui/themed";

const { width } = Dimensions.get("window");
const WHITE_CARD_HEIGHT = 160;
const DARK_HEADER_HEIGHT = -30;

export default function CarsSection() {
  return (
    <View style={{ height: WHITE_CARD_HEIGHT + 30, width: width }}>
      
      {/* 1. White card */}
      <View 
        className="absolute" 
        style={{ 
          marginTop: -80,
          zIndex: -1,
          width: width,
          ...Platform.select({ 
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 10 }, 
            android: { elevation: 8 } 
          }) 
        }} 
      >
        <Svg width={width} height={WHITE_CARD_HEIGHT} viewBox={`0 0 ${width} ${WHITE_CARD_HEIGHT}`}>
            <Path 
              d={`M0 0 H${width} V${WHITE_CARD_HEIGHT - 40} Q${width / 2} ${WHITE_CARD_HEIGHT + 40} 0 ${WHITE_CARD_HEIGHT - 40} Z`} 
              fill="#ffffff" 
            />
        </Svg>
      </View>

      {/* 2. Car avatar */}
      <View className="absolute items-center" style={{ top: DARK_HEADER_HEIGHT - 50, width: width }}>
        <View className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&q=80" }} 
            className="w-full h-full" 
          />
        </View>
      </View>

      {/* 3. Cars */}
      <View className="flex-row justify-between px-6" style={{ marginTop: 40 }}>
        <StatBubble name="BMW X6" km="321.000 KM" />
        <StatBubble name="Audi A5" km="120.000 KM" highlight />
        <StatBubble name="Dacia 1300" km="400.000 KM" />
      </View>
    </View>
  );
}