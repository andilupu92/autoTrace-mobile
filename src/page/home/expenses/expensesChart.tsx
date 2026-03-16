import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";
import { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function ExpensesChart() {
  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const data = [
    { id: 1, label: "Combustibil", amount: "1.200 RON", percentage: 85, color: "bg-orange-500" },
    { id: 2, label: "Service & Piese", amount: "450 RON", percentage: 40, color: "bg-gray-400" },
    { id: 3, label: "Spălătorie", amount: "120 RON", percentage: 15, color: "bg-gray-300" },
  ];

  const handleViewAllExpenses = () => {
    navigation.navigate("AllExpenses"); 
  };

  return (
    <Box>
      <Box className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <VStack space="lg">
          {data.map((item) => (
            <View key={item.id}>
              <View className="flex-row justify-between items-end mb-2">
                <VStack>
                  <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                    #{item.id} {item.label}
                  </Text>
                  <Text className="text-slate-800 font-bold text-base">{item.amount}</Text>
                </VStack>
                <Text className="text-gray-400 text-xs font-bold">{item.percentage}%</Text>
              </View>
              
              {/* Progress Bar Container */}
              <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <View 
                  className={`h-full ${item.color} rounded-full`} 
                  style={{ width: `${item.percentage}%` }} 
                />
              </View>
            </View>
          ))}
        </VStack>
        
        <View className="mt-5 pt-4 border-t border-gray-50 flex-row justify-between items-center">
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