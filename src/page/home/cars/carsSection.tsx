import { Platform, View, Dimensions } from "react-native";
import { Path, Svg } from "react-native-svg";
import Car from "./car";

const { width } = Dimensions.get("window");
const WHITE_CARD_HEIGHT = 160;

export default function CarsSection() {
  return (
    <View style={{ height: WHITE_CARD_HEIGHT + 20, width: width }}>
      
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

      {/* 3. Cars */}
      <View className="flex-row justify-between px-6" style={{ marginTop: 40 }}>
        <Car name="BMW X6" km="321.000 KM" />
        <Car name="Audi A5" km="120.000 KM" highlight />
        <Car name="Dacia 1300" km="400.000 KM" />
      </View>
    </View>
  );
}