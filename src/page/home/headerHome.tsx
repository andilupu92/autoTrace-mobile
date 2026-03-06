import { Box } from "@/components/ui/box";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { View, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@gluestack-ui/themed";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 180;
const DARK_HEADER_HEIGHT = 150;

export default function HeaderScreen({ openUserDetails }: { openUserDetails: () => void }) {
  return (
    <View style={{ backgroundColor: "white" }}>
      {/* Orange curved header */}
      <Svg width={width} height={HEADER_HEIGHT}>
        <Path
          d={`M0 0 H${width} V${HEADER_HEIGHT - 40} Q${width / 2} ${
            HEADER_HEIGHT + 40
          } 0 ${HEADER_HEIGHT - 40} Z`}
          fill="#F0A83A"
        />
      </Svg>

      <Box className="absolute w-full px-6 flex-row justify-between items-center"
        style={{ top: HEADER_HEIGHT * 0.35 }}>
        
        <VStack>
          <Heading className="text-black text-xl font-light">
            <Text className="font-bold text-xl">Hello, </Text>
            <Text className="font-bold text-bold text-2xl">Andrei</Text>
          </Heading>
        </VStack>

        <TouchableOpacity activeOpacity={0.7} onPress={openUserDetails}>
          <Avatar className="h-14 w-14 bg-violet-600 rounded-full border-2 border-white items-center justify-center overflow-hidden">
            <AvatarFallbackText className="text-white font-medium">
              AD
            </AvatarFallbackText>
            <AvatarImage
              source={{ uri: "https://i.pravatar.cc/300" }}
              className="w-full h-full absolute inset-0"
              alt="User Avatar"
            />
          </Avatar>
        </TouchableOpacity>
      </Box>

      {/* 2. Car avatar */}
      <View className="absolute items-center" style={{ top: DARK_HEADER_HEIGHT - 40, width: width, zIndex: 10 }}>
        <View className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&q=80" }} 
            className="w-full h-full" 
            alt="Car Avatar"
          />
        </View>
      </View>
    </View>
  );
}