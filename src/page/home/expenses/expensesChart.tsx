import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";
import { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AnimatedProgressBar from "@/src/utils/animatedProgressBar";
import { HStack } from "@/components/ui/hstack";

export default function ExpensesChart() {
  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const data = [
    { id: 1, icon: "⛽", iconBg: "#FFF3EB", label: "Combustibil", amount: "1.200 RON", percentage: 85, color: "#DC2626" },
    { id: 2, icon: "🔧", iconBg: "#F3F4F6", label: "Service & Piese", amount: "450 RON", percentage: 40, color: "#9CA3AF" },
    { id: 3, icon: "🚿", iconBg: "#EFF6FF", label: "Spălătorie", amount: "120 RON", percentage: 15, color: "#D1D5DB" },
  ];

  const handleViewAllExpenses = () => {
    navigation.navigate("AllExpenses"); 
  };

  return (
    <Box>
      <Box className="bg-white rounded-2xl px-4 pt-4 overflow-hidden shadow-sm shadow-black/5">
        <VStack space="lg">
          {data.map((item) => (
            <View key={item.id}>
              <HStack className="items-center gap-3.5 pb-2.5">
                <View
                  style={{ backgroundColor: item.iconBg }}
                  className="w-12 h-12 rounded-2xl items-center justify-center"
                >
                  <Text className="text-2xl">{item.icon}</Text>
                </View>
                <VStack className="flex-1 gap-0">
                  <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                    #{item.id} {item.label}
                  </Text>
                  <Text className="text-slate-800 font-bold text-base">{item.amount}</Text>
                </VStack>
                <Text className="text-gray-400 text-xs font-bold">{item.percentage}%</Text>
              </HStack>
            
              {/* ── Progress bar ── */}
              <HStack className="items-center pb-5">
                <AnimatedProgressBar pct={item.percentage} color={item.color} />
              </HStack>
            </View>
          ))}
        </VStack>
        
        <View className="pt-3 mb-3 border-t border-gray-50 flex-row justify-between items-center">
          <Text className="text-gray-400 text-xs italic">Total luna aceasta</Text>
          <Text className="text-orange-600 font-black text-lg">1.770 RON</Text>
        </View>
      </Box>

      <Pressable 
        onPress={handleViewAllExpenses}
        className="mt-4 bg-white py-2 px-6 rounded-full self-center shadow-sm flex-row items-center justify-center border border-gray-100"
      >
        <Text className="text-orange-500 font-medium text-sm">
          Vezi toate cheltuielile
        </Text>
      </Pressable>

    </Box>
  );
};