import { TouchableOpacity } from 'react-native';
import { 
  AvatarImage, 
  AvatarFallbackText,
} from '@gluestack-ui/themed';
import { View, Image, Dimensions, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import Svg, { Path } from "react-native-svg";
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Avatar } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width } = Dimensions.get("window");
const DARK_HEADER_HEIGHT = 180;
const WHITE_CARD_HEIGHT = 290;

export default function Cars() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const openUserDetails = () => {
        navigation.navigate('UserDetails');
    };
  return (
    <View className="flex-1 bg-gray-800">
      
      <View style={{ height: WHITE_CARD_HEIGHT + 50 }}>
        
        {/* 1. white card */}
        <View 
          className="absolute top-0 w-full"
          style={{
            ...Platform.select({
              ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15 },
              android: { elevation: 12 }
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

        {/* 2. black card */}
        <View className="absolute top-0 w-full">
          <Svg width={width} height={DARK_HEADER_HEIGHT} viewBox={`0 0 ${width} ${DARK_HEADER_HEIGHT}`}>
            <Path
              d={`M0 0 H${width} V${DARK_HEADER_HEIGHT - 30} Q${width / 2} ${DARK_HEADER_HEIGHT + 30} 0 ${DARK_HEADER_HEIGHT - 30} Z`}
              fill="#F0A83A"
            />
          </Svg>

            {/* HEADER */}
            <Box className="absolute w-full px-8 flex-row justify-between items-center"
                    style={{ top: DARK_HEADER_HEIGHT * 0.35, zIndex: 10 }}>
                <VStack className="flex-1">
                    <Heading className="text-black dark:text-white text-2xl font-light">
                        <Text className="font-bold text-xl">Hello, </Text><Text className="font-bold text-2xl text-black">Andrei</Text>
                    </Heading>
                </VStack>
                
            {/* RIGHT PART: Profile Icon */}
                <TouchableOpacity activeOpacity={0.7} onPress={openUserDetails}>
                    <Box className="relative">
                    
                        <Avatar className="h-14 w-14 bg-violet-600 rounded-full border-2 border-white dark:border-slate-950 shadow-xl shadow-violet-500/20 items-center justify-center overflow-hidden">
                            
                            <AvatarFallbackText className="text-white font-medium">
                                AD
                            </AvatarFallbackText>
                            
                            <AvatarImage
                                source={{
                                    uri: "https://i.pravatar.cc/300",
                                }}
                                className="w-full h-full absolute inset-0"
                                alt="User Avatar"
                            />
                        </Avatar>

                        <Box className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
                    </Box>
                </TouchableOpacity>
            </Box>
        </View>

        {/* 3. Avatarul main */}
        <View className="absolute w-full items-center" style={{ top: DARK_HEADER_HEIGHT - 60 }}>
          <View className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&q=80" }}
              className="w-full h-full"
            />
          </View>
        </View>

        {/* 4. cars */}
        <View 
          className="absolute w-full flex-row justify-around px-10" 
          style={{ top: WHITE_CARD_HEIGHT - 50 }}
        >
          <StatBubble name="Bmw X6" km="321.000 KM" />
          <StatBubble name="Audi A5" km="120.000 KM" highlight />
          <StatBubble name="Dacia 1300" km="400.000 km" />
        </View>

      </View>
    </View>
  );
}

function StatBubble({
  name,
  km,
  highlight = false,
}: {
  name: string;
  km: string;
  highlight?: boolean;
}) {
  return (
    <View className={`items-center ${!highlight ? "opacity-70" : ""}`}
    style={!highlight ? { marginTop: -12 } : undefined}>
      <View 
        className="w-20 h-20 rounded-full items-center justify-center bg-white"
        style={
          highlight 
            ? { 
                borderWidth: 1.5, 
                borderColor: '#f97316',
                elevation: 6,
                shadowColor: '#f97316',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }
            : { 
                borderColor: '#E5E7EB',
                borderTopColor: 'transparent',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
              } 
        }
      >
        <Text className={`font-bold text-center px-1 ${highlight ? "text-orange-500 text-[13px]" : "text-gray-400 text-[10px]"}`}>
          {name}
        </Text>
      </View>
      <Text className={`text-[10px] font-bold uppercase mt-3 tracking-tighter ${highlight ? "text-orange-400" : "text-gray-400"}`}>
        {km}
      </Text>
    </View>
  );
}