import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from "@/components/ui/text";
import { ActivityIndicator, Pressable, View } from "react-native";
import { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AnimatedProgressBar from "@/src/utils/animatedProgressBar";
import { HStack } from "@/components/ui/hstack";
import { useEffect, useState } from 'react';
import { documentApi } from '@/src/api/services/docService';
import formatCurrency  from '@/src/utils/formatCurrency';
import DynamicIcon from '@/src/utils/dynamicIcon';

type ExpenseItem = {
  expenseCategoryId: number;
  expenseCategoryName: string;
  expenseCategoryIconName: string;
  expenseCategoryIconLibrary: string;
  totalSum: number;
  percentage: number;
  ExpenseTransactions: ExpenseTransaction[];
};

type ExpenseTransaction = {
  id: number;
  name: string;
  amount: number;
  date: string;
}

export default function ExpensesChart({ carId }: { carId: number }) {
  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (carId === null) return;
    const fetchExpenses = async () => {
      try {
        setLoading(true);
          const expensesData = await documentApi.getExpenses(carId, new Date().getFullYear(), new Date().getMonth() + 1);
          setExpenses(expensesData);
          setTotalExpenses(expensesData.reduce((sum: number, item: ExpenseItem) => sum + item.totalSum, 0));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
    fetchExpenses();          
  }, [carId]);

  
        
  const handleViewAllExpenses = () => {
    navigation.navigate("AllExpenses", { carId }); 
  };

  return (
    <Box>
      {loading ? (
          <ActivityIndicator size="small" color="#F97316" style={{ marginTop: 16 }} />
        ) : expenses.length > 0 ? (
          <Box className="bg-white rounded-2xl px-4 pt-4 overflow-hidden shadow-sm shadow-black/5">
            <VStack space="lg">
              {expenses.slice(0, 3).map((item) => {

                const barColor = 
                  item.percentage >= 80 ? "#EF4444"
                  : item.percentage >= 50 ? "#F97316"
                  : "#22C55E";

                const pctColor =
                  item.percentage >= 80 ? "#EF4444"
                  : item.percentage >= 50 ? "#F97316"
                  : "#16A34A";

                return (
                  <View key={item.expenseCategoryId}>
                    <HStack className="items-center gap-3.5 pb-2.5">
                      <View
                        style={{ backgroundColor: "#e6eff5" }}
                        className="w-12 h-12 rounded-xl items-center justify-center"
                      >
                        <DynamicIcon 
                          library={item.expenseCategoryIconLibrary} 
                          name={item.expenseCategoryIconName}
                          size={24}
                          color="#3572d4"
                        />

                      </View>
                      <VStack className="flex-1 gap-0">
                        <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                          {item.expenseCategoryName}
                        </Text>
                        <Text className="text-slate-800 font-bold text-base">{formatCurrency(item.totalSum)} </Text>
                      </VStack>
                      <Text style={{ color: pctColor }} className="text-gray-400 text-xs font-bold">{item.percentage}% din buget</Text>
                    </HStack>
                  
                    {/* ── Progress bar ── */}
                    <HStack className="items-center pb-5">
                      <AnimatedProgressBar pct={item.percentage} color={barColor} />
                    </HStack>
                  </View>
                )}
              )}
            </VStack>
            <View className="pt-3 mb-3 border-t border-gray-50 flex-row justify-between items-center">
          <Text className="text-gray-400 text-xs italic">Total luna aceasta</Text>
          <Text className="text-orange-600 font-black text-lg">{formatCurrency(totalExpenses)}</Text>
        </View>
        
        </Box>        
      ) : null }
          
      {expenses.length > 0 && !loading ? (
        <Pressable 
          onPress={handleViewAllExpenses}
          className="mt-4 bg-white py-2 px-6 rounded-full self-center flex-row items-center justify-center border border-gray-100"
        >
          <Text className="text-orange-500 font-medium text-sm">
            Vezi toate cheltuielile
          </Text>
        </Pressable>
      ) : (
        <Text className="text-gray-400 italic text-center mt-4">
          Nu există cheltuieli pentru această lună.
        </Text>
      )}
    </Box>
  );
};