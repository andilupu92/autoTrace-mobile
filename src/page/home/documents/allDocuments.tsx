import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DocumentCard from "./document";

export default function AllDocumentsScreen() {
  const navigation = useNavigation();
  const theme = { backArrowColor: "#F97316" }; 

  const handleEditDoc = (data: { name: string; expiryDate: Date }) => {
    console.log("Edit document:", data.name);
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
        <View className="mt-2 flex-col gap-4">
          <DocumentCard 
            name="RCA Insurance" 
            daysRemaining={2} 
            expiryDate={new Date("2026-03-14")} 
            onEdit={handleEditDoc}
          />
          <DocumentCard 
            name="ITP Inspection" 
            daysRemaining={7} 
            expiryDate={new Date("2026-03-19")} 
            onEdit={handleEditDoc}
          />
          <DocumentCard 
            name="Road Tax" 
            daysRemaining={24} 
            expiryDate={new Date("2026-04-05")} 
            onEdit={handleEditDoc}
          />
          <DocumentCard 
            name="Casco Insurance" 
            daysRemaining={145} 
            expiryDate={new Date("2026-08-04")} 
            onEdit={handleEditDoc}
          />
          <DocumentCard 
            name="Vignette (Rovinietă)" 
            daysRemaining={210} 
            expiryDate={new Date("2026-10-08")} 
            onEdit={handleEditDoc}
          />
          <DocumentCard 
            name="Medical Kit" 
            daysRemaining={400} 
            expiryDate={new Date("2027-04-16")} 
            onEdit={handleEditDoc}
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}