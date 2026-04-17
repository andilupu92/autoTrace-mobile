import DynamicIcon from "@/src/utils/dynamicIcon";
import { View, Text } from "react-native";
import Svg, { Rect } from "react-native-svg";

type Category = {
  expenseCategoryIconLibrary: string;
  expenseCategoryName: string;
  expenseCategoryIconName: string;
  percentage: number;
};

type Props = {
  totalAmount: string;
  currentMonth: string;
  categories: Category[];
};

export default function ExpenseSummaryCard({ totalAmount, currentMonth, categories }: Props) {
  const overBudget = categories.filter((c) => c.percentage >= 80);
  const warning    = categories.filter((c) => c.percentage >= 50 && c.percentage < 80);

  return (
    <View className="mb-6 flex-col gap-3">

      <View
        className="bg-white rounded-2xl px-4 py-4"
        style={{
          borderWidth: 1,
          borderColor: "#FED7AA",         // orange-200
          shadowColor: "#F97316",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.10,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Luna */}
        <Text
          className="text-center text-[10px] font-bold tracking-[1.5px] mb-3"
          style={{ color: "#F97316" }}
        >
          {currentMonth}
        </Text>

        {/* Totaluri */}
        <View className="flex-row gap-3 mb-4">
          <View
            className="flex-1 rounded-xl px-4 py-3"
            style={{ backgroundColor: "#FFF7ED" }}
          >
            <Text className="text-[10px] font-bold tracking-[1.2px] mb-0.5" style={{ color: "#FB923C" }}>
              TOTAL CHELTUIELI
            </Text>
            <Text className="text-[24px] font-extrabold -tracking-[0.5px]" style={{ color: "#1E293B" }}>
              {totalAmount}
            </Text>
          </View>

          <View
            className="rounded-xl px-4 py-3 items-center justify-center min-w-[76px]"
            style={{ backgroundColor: "#FFF7ED" }}
          >
            <Text className="text-[10px] font-bold tracking-[1.2px] mb-0.5" style={{ color: "#FB923C" }}>
              CATEGORII
            </Text>
            <Text className="text-[24px] font-extrabold" style={{ color: "#1E293B" }}>
              {categories.length}
            </Text>
          </View>
        </View>

        {/* Separator */}
        <View className="h-px mb-4" style={{ backgroundColor: "#FEE2C8" }} />

        {/* Chart */}
        <Text className="text-[10px] font-bold tracking-[1.2px] mb-3" style={{ color: "#94A3B8" }}>
          CONSUM PE CATEGORII
        </Text>
        <CategoryBarChart categories={categories} />
      </View>

      {/* ── Alert: depășit 80% ── */}
      {overBudget.length > 0 && (
        <View
          className="bg-red-50 rounded-2xl px-4 py-3 flex-row items-start gap-3"
          style={{ borderWidth: 1, borderColor: "#FECACA" }}
        >
          <Text className="text-lg mt-0.5">🚨</Text>
          <View className="flex-1">
            <Text className="text-red-700 font-bold text-sm mb-1">
              {overBudget.length === 1
                ? "1 categorie a depășit 80% din buget!"
                : `${overBudget.length} categorii au depășit 80% din buget!`}
            </Text>
            {overBudget.map((c) => (
              <Text key={c.expenseCategoryName} className="text-red-500 text-xs">
                • <DynamicIcon
                    library={c.expenseCategoryIconLibrary}
                    name={c.expenseCategoryIconName}
                    size={10}
                    color="#3572d4"
                  /> 
                  {" "}{c.expenseCategoryName} — {c.percentage}%
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* ── Alert: 50–79% ── */}
      {warning.length > 0 && (
        <View
          className="bg-orange-50 rounded-2xl px-4 py-3 flex-row items-start gap-3"
          style={{ borderWidth: 1, borderColor: "#FED7AA" }}
        >
          <Text className="text-lg mt-0.5">⚠️</Text>
          <View className="flex-1">
            <Text className="text-orange-700 font-bold text-sm mb-1">
              {warning.length === 1
                ? "1 categorie a depășit jumătate din buget."
                : `${warning.length} categorii au depășit jumătate din buget.`}
            </Text>
            {warning.map((c) => (
              <Text key={c.expenseCategoryName} className="text-orange-500 text-xs">
                • <DynamicIcon
                    library={c.expenseCategoryIconLibrary}
                    name={c.expenseCategoryIconName}
                    size={10}
                    color="#3572d4"
                  /> 
                  {" "}{c.expenseCategoryName} — {c.percentage}%
              </Text>
            ))}
          </View>
        </View>
      )}

    </View>
  );
}

function CategoryBarChart({ categories }: { categories: Category[] }) {
  const WIDTH   = 350;
  const BAR_H   = 10;
  const LABEL_W = 128;
  const BAR_MAX = WIDTH - LABEL_W - 44;

  return (
    <View>
      {categories.map((cat, i) => {
        const barW = Math.max(6, (cat.percentage / 100) * BAR_MAX);

        const barColor =
          cat.percentage >= 80 ? "#EF4444"
          : cat.percentage >= 50 ? "#F97316"
          : "#22C55E";

        const pctColor =
          cat.percentage >= 80 ? "#EF4444"
          : cat.percentage >= 50 ? "#F97316"
          : "#16A34A";

        return (
          <View
            key={cat.expenseCategoryName}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
          >
            {/* Icon + Name */}
            <View style={{ flexDirection: "row", alignItems: "center", width: LABEL_W }}>
              <DynamicIcon
                library={cat.expenseCategoryIconLibrary}
                name={cat.expenseCategoryIconName}
                size={10}
                color="#3572d4"
              />
              <Text style={{ marginLeft: 5, fontSize: 12, fontWeight: "600", color: "#475569" }}>
                {cat.expenseCategoryName.length > 15
                  ? cat.expenseCategoryName.slice(0, 15) + "…"
                  : cat.expenseCategoryName}
              </Text>
            </View>

            {/* Bara */}
            <Svg width={BAR_MAX} height={BAR_H}>
              <Rect x={0} y={0} width={BAR_MAX} height={BAR_H} rx={BAR_H / 2} fill="#F1F5F9" />
              <Rect x={0} y={0} width={barW} height={BAR_H} rx={BAR_H / 2} fill={barColor} opacity={0.85} />
            </Svg>

            {/* Procent */}
            <Text style={{ marginLeft: 10, fontSize: 10, fontWeight: "700", color: pctColor }}>
              {cat.percentage}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}