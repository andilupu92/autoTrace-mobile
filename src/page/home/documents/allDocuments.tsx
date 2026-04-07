import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DocumentCard from "./document";
import HeaderSection from "@/src/utils/headerSection";
import { useState } from "react";
import AddDocuments from "./addDocuments";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import DynamicIcon from "@/src/utils/dynamicIcon";

type Document = {
  id: number;
  documentCategoryId: number;
  documentCategoryName: string;
  expiryDate: string;
  daysRemaining: number;
  documentCategoryIconName: string;
  documentCategoryIconLibrary: string;
};

export default function AllDocumentsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "AllDocuments">>();
  const { documents } = route.params;
  const { currentCarId } = route.params;
  const navigation = useNavigation();
  const [isSheetDocOpen, setIsSheetDocOpen] = useState(false);
  const [editingDocData, setEditingDocData] = useState<{ documentCategoryId: number; expiryDate: Date; documentId: number } | null>(null);
  const theme = { backArrowColor: "#F97316" }; 

  const handleEditDoc = (data: { documentCategoryId: number; expiryDate: Date; documentId: number }) => {
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
              key={doc.id}
              documentId={doc.id}
              documentCategoryId={doc.documentCategoryId}
              icon={doc.documentCategoryIconName}
              library={doc.documentCategoryIconLibrary}
              iconBg="#e6eff5"
              name={doc.documentCategoryName}
              daysRemaining={doc.daysRemaining}
              expiryDate={new Date(doc.expiryDate)}
              onEdit={handleEditDoc}
            />
          ))}
        </View>
      </ScrollView>

      <AddDocuments
        key={editingDocData ? `doc-${editingDocData.documentId}-${Date.now()}` : "doc-add"}
        isVisible={isSheetDocOpen}
        initialData={editingDocData}
        carId={currentCarId}
        onClose={() => {
          setIsSheetDocOpen(false);
          setEditingDocData(null);
        }}
      />

    </SafeAreaView>
  );
}

function AlertBanner({ docs }: { docs: Document[] }) {
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
              <Text key={d.id} className="text-red-500 text-xs">
                • <DynamicIcon 
                    library={d.documentCategoryIconLibrary} 
                    name={d.documentCategoryIconName}
                    size={12}
                    color="#668df8"
                  />{" "} {d.documentCategoryName} — {d.daysRemaining === 0 ? "azi!" : `${d.daysRemaining} ${d.daysRemaining === 1 ? "zi" : "zile"}`}
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
              <Text key={d.id} className="text-orange-500 text-xs">
                • {d.documentCategoryIconName} {d.documentCategoryName} — {d.daysRemaining} zile
              </Text>
            ))}
          </View>
        </View>
      )}

    </View>
  );
}