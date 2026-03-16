import { Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { View } from "react-native";
import { Text } from '@/components/ui/text';
import CarsSection from "./cars/carsSection";
import HeaderSection from "../../utils/headerSection";
import DocumentCard from "./documents/document";
import ExpensesChart from "./expenses/expensesChart";
import { useState } from "react";
import AddDocuments from "./documents/addDocuments";
import Header from "./header";
import AddCar from "./cars/addCar";
import AddExpenses from "./expenses/addExpenses";

export default function HomeScreen() {
  const [isSheetDocOpen, setIsSheetDocOpen] = useState(false);
  const [isSheetCarOpen, setIsSheetCarOpen] = useState(false);
  const [isSheetExpensesOpen, setIsSheetExpensesOpen] = useState(false);
  const [editingDocData, setEditingDocData] = useState<{ name: string; expiryDate: Date } | null>(null);
  const [editingCarData, setEditingCarData] = useState<{ brand: string; model: string; kilometers: string; year: number } | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openUserDetails = () => {
    navigation.navigate("UserDetails");
  };

  const handleEditDoc = (data: { name: string; expiryDate: Date }) => {
    setEditingDocData(data);
    setIsSheetDocOpen(true);
  };

  const handleEditCar = (data: { brand: string; model: string; kilometers: string; year: number }) => {
    setEditingCarData(data);
    setIsSheetCarOpen(true);
  };

  const handleViewAllDocuments = () => {
    navigation.navigate("AllDocuments"); 
  };

  return (
    <View style={{ flex: 1 }}>

      <Header openUserDetails={openUserDetails} />

      <ScrollView
        className="flex-1 bg-gray-150"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >

       <View className="mt-4">
          <CarsSection onAddCar={() => setIsSheetCarOpen(true)} onEditCar={handleEditCar} />
        </View>

        <View className="px-6 mt-12">
          <View>
            <HeaderSection
              name="My Documents"
              onAdd={() => setIsSheetDocOpen(true)}
            />

            <DocumentCard name="RCA Insurance" daysRemaining={2} expiryDate={new Date("2026-03-08")} onEdit={handleEditDoc}/>
            <DocumentCard name="ITP Inspection" daysRemaining={7} expiryDate={new Date("2026-03-15")} onEdit={handleEditDoc}/>
            <DocumentCard name="Road Tax" daysRemaining={24} expiryDate={new Date("2026-03-30")} onEdit={handleEditDoc}/>
          
            <Pressable 
              onPress={handleViewAllDocuments}
              className="mt-4 bg-white py-2 px-6 rounded-full self-center shadow-sm flex-row items-center justify-center border border-gray-100"
            >
              <Text className="text-orange-500 font-medium text-sm">
                Vezi toate documentele
              </Text>
            </Pressable>

          </View>
        </View>

        <View className="px-6 mt-5">
          <HeaderSection
            name="My Expenses"
            onAdd={() => setIsSheetExpensesOpen(true)}
          />
          <ExpensesChart />
        </View>
      </ScrollView>

      <AddCar
        key={editingCarData ? `car-${editingCarData.brand}-${Date.now()}` : "car-add"}
        isVisible={isSheetCarOpen}
        initialData={editingCarData}
        onClose={() => {
          setIsSheetCarOpen(false);
          setEditingCarData(null);
        }}
      />

      <AddDocuments
        key={editingDocData ? `doc-${editingDocData.name}-${Date.now()}` : "doc-add"}
        isVisible={isSheetDocOpen}
        initialData={editingDocData}
        onClose={() => {
          setIsSheetDocOpen(false);
          setEditingDocData(null);
        }}
      />

      <AddExpenses
        isVisible={isSheetExpensesOpen}
        onClose={() => {
          setIsSheetExpensesOpen(false);
        }}
      />

    </View>
  );
}