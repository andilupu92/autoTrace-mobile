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
import DynamicIcon from "@/src/utils/dynamicIcon";
import formatDate from "@/src/utils/formatDate";

interface Transaction {
  id: number;
  name: string;
  date: string;
  amount: number;
}

interface ExpenseCategoryProps {
  expenseCategoryId: number;
  expenseCategoryName: string;
  expenseCategoryIconName: string;
  expenseCategoryIconLibrary: string;
  percentage: number;
  transactions?: Transaction[];
}

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ExpenseCategory({
  expenseCategoryId,
  expenseCategoryIconName,
  expenseCategoryIconLibrary,
  expenseCategoryName,
  percentage,
  transactions = [],
}: ExpenseCategoryProps) {
  const [open, setOpen]           = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [txs, setTxs]    = useState<Transaction[]>(transactions);

  const barColor = percentage >= 80 ? "#EF4444"
                  : percentage >= 50 ? "#F97316"
                  : "#22C55E";

  const pctColor = percentage >= 80 ? "#EF4444"
                  : percentage >= 50 ? "#F97316"
                  : "#16A34A";
 
  const total = txs.reduce((s, t) => s + t.amount, 0);
 
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
            style={{ backgroundColor: "#e6eff5" }}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            <DynamicIcon 
              library={expenseCategoryIconLibrary} 
              name={expenseCategoryIconName}
              size={24}
              color="#668df8"
            />
          </View>
 
          {/* Meta */}
          <VStack className="flex-1 gap-0">
            <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              #
            </Text>
            <Text className="text-base font-bold text-gray-900 leading-tight">
              {expenseCategoryName}
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
              {percentage}% din buget
            </Text>
          </VStack>
        </HStack>
      </Pressable>
 
      {/* ── Progress bar + toggle ── */}
      <HStack className="items-center gap-2.5 px-4 pb-3">
        <AnimatedProgressBar pct={percentage} color={barColor} />
        <TouchableOpacity onPress={toggleOpen} className="p-0.5">
          <Chevron open={open} />
        </TouchableOpacity>
      </HStack>
 
      {/* ── Expandable body ── */}
      {open && (
        <VStack>
          <Divider className="bg-gray-100" />
 
          {txs.map((tx, i) => (
            <TransactionRow key={i} {...tx} />
          ))}
 
          {/* Add section */}
          <Box className="px-4 pt-2.5 pb-4">
            {!showForm ? (
              <TouchableOpacity
                onPress={() => setShowForm(true)}
                activeOpacity={0.7}
                className="w-full py-3  rounded-xl border border-dashed border-gray-300 items-center"
              >
                <Text className="text-sm font-semibold text-gray-500">
                  + Adaugă cheltuială
                </Text>
              </TouchableOpacity>
            ) : (
              <AddForm
                accentColor="#30f237"
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

function TransactionRow({ name, date, amount }: Transaction) {
  return (
    <HStack className="items-center justify-between px-5 py-3 border-b border-gray-100">
      <VStack className="gap-0.5">
        <Text className="text-sm font-semibold text-gray-900">{name}</Text>
        <Text className="text-xs text-gray-400">
          {formatDate(date)}
        </Text>
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