import { useState, useRef, useEffect } from "react";
import { Divider } from "@/components/ui/divider";
import { Text } from '@/components/ui/text';
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { TouchableOpacity, LayoutAnimation, Pressable, Platform, UIManager } from "react-native";
import formatCurrency from "@/src/utils/formatCurrency";
import { View, Animated } from "react-native";
import AddForm from "./addForm";
import AnimatedProgressBar from "@/src/utils/animatedProgressBar";

interface Transaction {
  name: string;
  date: string;
  amount: number;
}

interface ExpenseCategoryProps {
  rank: number;
  icon: string;
  iconBg?: string;
  name: string;
  budgetPct: number;
  barColor?: string;
  pctColor?: string;
  initialTransactions?: Transaction[];
}

function TransactionRow({ name, date, amount }: Transaction) {
  return (
    <HStack className="items-center justify-between px-5 py-3 border-b border-gray-100">
      <VStack className="gap-0.5">
        <Text className="text-sm font-semibold text-gray-900">{name}</Text>
        <Text className="text-xs text-gray-400">{date}</Text>
      </VStack>
      <Text className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</Text>
    </HStack>
  );
}

function Chevron({ open }: { open: boolean }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: open ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [open]);
 
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
 
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      {/* Simple chevron using Text — swap with lucide-react-native if installed */}
      <Text className={`text-base ${open ? "text-gray-900" : "text-gray-400"}`}>
        ▾
      </Text>
    </Animated.View>
  );
}

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ExpenseCategory({
  rank,
  icon,
  iconBg = "#F3F4F6",
  name,
  budgetPct,
  barColor = "#9CA3AF",
  pctColor = "#6B7280",
  initialTransactions = [],
}: ExpenseCategoryProps) {
  const [open, setOpen]           = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [transactions, setTxs]    = useState<Transaction[]>(initialTransactions);
 
  const total = transactions.reduce((s, t) => s + t.amount, 0);
 
  function toggleOpen() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
    if (open) setShowForm(false);
  }
 
  function handleAdd(tx: Transaction) {
    setTxs((prev) => [tx, ...prev]);
    setShowForm(false);
  }
 
  return (
    <Box className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-black/5">
 
      {/* ── Header ── */}
      <Pressable onPress={toggleOpen}>
        <HStack className="items-center gap-3.5 px-4 pt-4 pb-2.5">
          {/* Icon */}
          <View
            style={{ backgroundColor: iconBg }}
            className="w-12 h-12 rounded-2xl items-center justify-center"
          >
            <Text className="text-2xl">{icon}</Text>
          </View>
 
          {/* Meta */}
          <VStack className="flex-1 gap-0">
            <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              #{rank}
            </Text>
            <Text className="text-base font-bold text-gray-900 leading-tight">
              {name}
            </Text>
          </VStack>
 
          {/* Amount + pct */}
          <VStack className="items-end gap-0">
            <Text className="text-[17px] font-bold text-gray-900">
              {formatCurrency(total)}
            </Text>
            <Text
              style={{ color: pctColor }}
              className="text-xs font-semibold mt-0.5"
            >
              {budgetPct}% din buget
            </Text>
          </VStack>
        </HStack>
      </Pressable>
 
      {/* ── Progress bar + toggle ── */}
      <HStack className="items-center gap-2.5 px-4 pb-3">
        <AnimatedProgressBar pct={budgetPct} color={barColor} />
        <TouchableOpacity onPress={toggleOpen} className="p-0.5">
          <Chevron open={open} />
        </TouchableOpacity>
      </HStack>
 
      {/* ── Expandable body ── */}
      {open && (
        <VStack>
          <Divider className="bg-gray-100" />
 
          {transactions.map((tx, i) => (
            <TransactionRow key={i} {...tx} />
          ))}
 
          {/* Add section */}
          <Box className="px-4 pt-2.5 pb-4">
            {!showForm ? (
              <TouchableOpacity
                onPress={() => setShowForm(true)}
                activeOpacity={0.7}
                className="w-full py-3 rounded-xl border border-dashed border-gray-300 items-center"
              >
                <Text className="text-sm font-semibold text-gray-500">
                  + Adaugă cheltuială
                </Text>
              </TouchableOpacity>
            ) : (
              <AddForm
                accentColor={barColor}
                onAdd={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            )}
          </Box>
        </VStack>
      )}
    </Box>
  );
}