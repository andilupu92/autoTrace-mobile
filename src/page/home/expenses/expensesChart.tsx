import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from "@/components/ui/text";
import { View } from "react-native";


export default function ExpensesChart() {
  const data = [
    { id: 1, label: "Combustibil", amount: "1.200 RON", percentage: 85, color: "bg-orange-500" },
    { id: 2, label: "Service & Piese", amount: "450 RON", percentage: 40, color: "bg-gray-400" },
    { id: 3, label: "Spălătorie", amount: "120 RON", percentage: 15, color: "bg-gray-300" },
  ];

  return (
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
  );
};