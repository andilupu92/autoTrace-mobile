import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { VStack } from "@/components/ui/vstack";
import ExpenseCategory from "./expenseCategory";
import ExpenseSummaryCard from "./expenseSummary";

export default function AllExpensesScreen() {
  const navigation = useNavigation();
  const theme = { backArrowColor: "#F97316" };

  const totalAmount = "2.650 RON";
  const currentMonth = "MARTIE 2025";

  const CATEGORIES = [
    {
      rank: 1, icon: "⛽", iconBg: "#FFF3EB", name: "Combustibil",
      budgetPct: 85, barColor: "#F97316", pctColor: "#F97316",
      initialTransactions: [
        { name: "Benzinărie MOL",    date: "10 Mar 2025", amount: 400 },
        { name: "Benzinărie Petrom", date: "22 Feb 2025", amount: 450 },
        { name: "Benzinărie OMV",    date: "05 Feb 2025", amount: 350 },
      ],
    },
    {
      rank: 2, icon: "🔧", iconBg: "#F3F4F6", name: "Service & Piese",
      budgetPct: 53, barColor: "#9CA3AF", pctColor: "#6B7280",
      initialTransactions: [
        { name: "Auto Total Service",  date: "15 Mar 2025", amount: 250 },
        { name: "Piese Auto Dedeman",  date: "01 Mar 2025", amount: 200 },
      ],
    },
    {
      rank: 3, icon: "🚿", iconBg: "#EFF6FF", name: "Spălătorie",
      budgetPct: 15, barColor: "#C4CBDA", pctColor: "#6B7280",
      initialTransactions: [
        { name: "Spălătorie Auto Plus", date: "08 Mar 2025", amount: 70 },
        { name: "Car Wash Express",     date: "20 Feb 2025", amount: 50 },
      ],
    },
    {
      rank: 4, icon: "🅿️", iconBg: "#ECFDF5", name: "Parcare",
      budgetPct: 10, barColor: "#10B981", pctColor: "#10B981",
      initialTransactions: [
        { name: "Parcare Palas Mall", date: "12 Mar 2025", amount: 40 },
        { name: "Parcare Centru",     date: "03 Mar 2025", amount: 40 },
      ],
    },
  ];

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
          totalAmount={totalAmount}
          currentMonth={currentMonth}
          categories={CATEGORIES}
        />

        <VStack className="mt-5 gap-3">
          {CATEGORIES.map((cat) => (
            <ExpenseCategory key={cat.rank} {...cat} />
          ))}
        </VStack>

      </ScrollView>
    </SafeAreaView>
  );
}