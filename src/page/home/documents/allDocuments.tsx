import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DocumentCard from "./document";
import HeaderSection from "@/src/utils/headerSection";
import { useState } from "react";
import AddDocuments from "./addDocuments";

type DocumentItem = {
  icon: string;
  iconBg: string;
  name: string;
  daysRemaining: number;
  expiryDate: Date;
};

const documents: DocumentItem[] = [
  { icon: "⛽", iconBg: "#FFF3EB", name: "RCA Insurance",        daysRemaining: 2,   expiryDate: new Date("2026-03-14") },
  { icon: "🛠️", iconBg: "#F3F4F6", name: "ITP Inspection",       daysRemaining: 7,   expiryDate: new Date("2026-03-19") },
  { icon: "🛣️", iconBg: "#F3F4F6", name: "Road Tax",             daysRemaining: 24,  expiryDate: new Date("2026-04-05") },
  { icon: "⛽", iconBg: "#FFF3EB", name: "Casco Insurance",       daysRemaining: 145, expiryDate: new Date("2026-08-04") },
  { icon: "🎫", iconBg: "#F3F4F6", name: "Vignette (Rovinietă)", daysRemaining: 210, expiryDate: new Date("2026-10-08") },
  { icon: "⚕️", iconBg: "#F3F4F6", name: "Medical Kit",          daysRemaining: 400, expiryDate: new Date("2027-04-16") },
];

export default function AllDocumentsScreen() {
  const navigation = useNavigation();
  const [isSheetDocOpen, setIsSheetDocOpen] = useState(false);
  const [editingDocData, setEditingDocData] = useState<{ name: string; expiryDate: Date } | null>(null);
  const theme = { backArrowColor: "#F97316" }; 

  const handleEditDoc = (data: { name: string; expiryDate: Date }) => {
    setEditingDocData(data);
    setIsSheetDocOpen(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-150">
      
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
          All Documents
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        <View className="mt-3">
          <AlertBanner docs={documents} />
        </View>

        <View className="mb-8" />
        <HeaderSection
          name="My Documents"
          onAdd={() => setIsSheetDocOpen(true)}
        />

        <View className="mt-2 flex-col gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.name}
              icon={doc.icon}
              iconBg={doc.iconBg}
              name={doc.name}
              daysRemaining={doc.daysRemaining}
              expiryDate={doc.expiryDate}
              onEdit={handleEditDoc}
            />
          ))}
        </View>
      </ScrollView>

      <AddDocuments
        key={editingDocData ? `doc-${editingDocData.name}-${Date.now()}` : "doc-add"}
        isVisible={isSheetDocOpen}
        initialData={editingDocData}
        onClose={() => {
          setIsSheetDocOpen(false);
          setEditingDocData(null);
        }}
      />

    </SafeAreaView>
  );
}

function AlertBanner({ docs }: { docs: DocumentItem[] }) {
  const urgent = docs.filter((d) => d.daysRemaining <= 3);
  const soon   = docs.filter((d) => d.daysRemaining > 3 && d.daysRemaining <= 7);

  // Dacă nu există nicio alertă, nu afișăm nimic
  if (urgent.length === 0 && soon.length === 0) return null;

  return (
    <View className="mb-4 flex-col gap-3">
      
      {/* ── URGENT: ≤ 3 zile ── */}
      {urgent.length > 0 && (
        <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex-row items-start gap-3">
          <Text className="text-lg mt-0.5">🚨</Text>
          <View className="flex-1">
            <Text className="text-red-700 font-bold text-sm mb-1">
              {urgent.length === 1
                ? "1 document expiră în mai puțin de 3 zile!"
                : `${urgent.length} documente expiră în mai puțin de 3 zile!`}
            </Text>
            {urgent.map((d) => (
              <Text key={d.name} className="text-red-500 text-xs">
                • {d.icon} {d.name} — {d.daysRemaining === 0 ? "azi!" : `${d.daysRemaining} ${d.daysRemaining === 1 ? "zi" : "zile"}`}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* ── SOON: 4–7 zile ── */}
      {soon.length > 0 && (
        <View className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 flex-row items-start gap-3">
          <Text className="text-lg mt-0.5">⚠️</Text>
          <View className="flex-1">
            <Text className="text-orange-700 font-bold text-sm mb-1">
              {soon.length === 1
                ? "1 document expiră în curând (7 zile)."
                : `${soon.length} documente expiră în curând (7 zile).`}
            </Text>
            {soon.map((d) => (
              <Text key={d.name} className="text-orange-500 text-xs">
                • {d.icon} {d.name} — {d.daysRemaining} zile
              </Text>
            ))}
          </View>
        </View>
      )}

    </View>
  );
}