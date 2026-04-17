import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { VStack } from "@/components/ui/vstack";
import ExpenseCategory from "./expenseCategory";
import ExpenseSummaryCard from "./expenseSummary";
import { useEffect, useState } from "react";
import { documentApi } from '@/src/api/services/docService';
import formatCurrency from "@/src/utils/formatCurrency";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { useRoute, RouteProp } from "@react-navigation/native";
import monthCurrent from "@/src/utils/monthCurrent";

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

export default function AllExpensesScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "AllExpenses">>();
  const { carId } = route.params;
  const navigation = useNavigation();
  const theme = { backArrowColor: "#F97316" };
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const currentMonth = monthCurrent(new Date());

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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-start active:opacity-70"
        >
          <Ionicons
            name="arrow-back-circle-sharp"
            size={32}
            color={theme.backArrowColor}
          />
        </Pressable>

        <Text className="text-xl font-bold text-slate-800 tracking-tight">
          Toate Cheltuielile
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        <ExpenseSummaryCard
          totalAmount={formatCurrency(totalExpenses)}
          currentMonth={currentMonth}
          categories={expenses}
        />

        <VStack className="mt-5 gap-3">
          {expenses.map((cat) => (
            <ExpenseCategory key={cat.expenseCategoryId} {...cat} />
          ))}
        </VStack>

      </ScrollView>
    </SafeAreaView>
  );
}