import { View, Text } from "react-native";
import Svg, { Rect, Text as SvgText, G } from "react-native-svg";

type Category = {
  name: string;
  icon: string;
  budgetPct: number;
};

type Props = {
  totalAmount: string;
  currentMonth: string;
  categories: Category[];
};

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function CategoryBarChart({ categories }: { categories: Category[] }) {
  const WIDTH   = 320;
  const BAR_H   = 16;
  const GAP     = 14;
  const LABEL_W = 108;
  const BAR_MAX = WIDTH - LABEL_W - 44;
  const HEIGHT  = categories.length * (BAR_H + GAP);

  return (
    <Svg width="100%" height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      {categories.map((cat, i) => {
        const y    = i * (BAR_H + GAP);
        const barW = Math.max(6, (cat.budgetPct / 100) * BAR_MAX);

        const barColor =
          cat.budgetPct >= 80 ? "#EF4444"
          : cat.budgetPct >= 50 ? "#F97316"
          : "#22C55E";

        const pctColor =
          cat.budgetPct >= 80 ? "#EF4444"
          : cat.budgetPct >= 50 ? "#F97316"
          : "#16A34A";

        return (
          <G key={cat.name}>
            {/* Label */}
            <SvgText
              x={0}
              y={y + BAR_H - 3}
              fontSize={11}
              fontWeight="600"
              fill="#475569"
            >
              {cat.icon} {cat.name.length > 11 ? cat.name.slice(0, 11) + "…" : cat.name}
            </SvgText>

            {/* Track */}
            <Rect
              x={LABEL_W}
              y={y}
              width={BAR_MAX}
              height={BAR_H}
              rx={BAR_H / 2}
              fill="#F1F5F9"
            />

            {/* Bar */}
            <Rect
              x={LABEL_W}
              y={y}
              width={barW}
              height={BAR_H}
              rx={BAR_H / 2}
              fill={barColor}
              opacity={0.85}
            />

            {/* Procent */}
            <SvgText
              x={LABEL_W + BAR_MAX + 6}
              y={y + BAR_H - 3}
              fontSize={10}
              fontWeight="700"
              fill={pctColor}
            >
              {cat.budgetPct}%
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

// ─── Card principal ───────────────────────────────────────────────────────────
export default function ExpenseSummaryCard({ totalAmount, currentMonth, categories }: Props) {
  const overBudget = categories.filter((c) => c.budgetPct >= 80);
  const warning    = categories.filter((c) => c.budgetPct >= 50 && c.budgetPct < 80);

  return (
    <View className="mb-6 flex-col gap-3">

      {/* ── Card principal: sumar ── */}
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
              <Text key={c.name} className="text-red-500 text-xs">
                • {c.icon} {c.name} — {c.budgetPct}%
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
              <Text key={c.name} className="text-orange-500 text-xs">
                • {c.icon} {c.name} — {c.budgetPct}%
              </Text>
            ))}
          </View>
        </View>
      )}

    </View>
  );
}