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
import { useCallback, useEffect, useState } from "react";
import AddDocuments from "./documents/addDocuments";
import Header from "./header";
import AddCar from "./cars/addCar";
import AddExpenses from "./expenses/addExpenses";
import { documentApi } from "@/src/api/services/docService";
import { ActivityIndicator } from "react-native";

type Document = {
  id: number;
  documentCategoryId: number;
  documentCategoryName: string;
  expiryDate: string;
  daysRemaining: number;
  documentCategoryIconName: string;
  documentCategoryIconLibrary: string;
};

export default function HomeScreen() {
  const [isSheetDocOpen, setIsSheetDocOpen] = useState(false);
  const [isSheetCarOpen, setIsSheetCarOpen] = useState(false);
  const [isSheetExpensesOpen, setIsSheetExpensesOpen] = useState(false);
  const [editingDocData, setEditingDocData] = useState<{ documentCategoryId: number; expiryDate: Date; documentId: number } | null>(null);
  const [editingCarData, setEditingCarData] = useState<{ id: number; brandId: number; brandName: string; modelId: number; modelName: string; kilometers: number; year: number } | null>(null);
  const [currentCarLogo, setCurrentCarLogo] = useState<string | null>(null);
  const [currentCarId, setCurrentCarId] = useState<number>(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openUserDetails = () => {
    navigation.navigate("UserDetails");
  };

  const handleCarChange = useCallback((logoUrl: string, id: number) => {
    setCurrentCarLogo(logoUrl);
    setCurrentCarId(id);
  }, []);

  useEffect(() => {
    if (currentCarId === null) return;

    const fetchDocuments = async () => {
      try {
        setLoadingDocs(true);
        const data = await documentApi.getDocuments(currentCarId);
        setDocuments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocuments();
  }, [currentCarId]);

  const handleEditDoc = (data: { documentCategoryId: number; expiryDate: Date; documentId: number }) => {
    setEditingDocData(data);
    setIsSheetDocOpen(true);
  };

  const handleEditCar = (data: { id: number; brandId: number; brandName: string; modelId: number; modelName: string; kilometers: number; year: number }) => {
    setEditingCarData(data);
    setIsSheetCarOpen(true);
  };

  const handleViewAllDocuments = () => {
    navigation.navigate("AllDocuments", { documents, currentCarId }); 
  };

  return (
    <View style={{ flex: 1 }}>

      <Header openUserDetails={openUserDetails} logoUrl={currentCarLogo} />

      <ScrollView
        className="flex-1 bg-gray-150"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >

       <View className="mt-4">
          <CarsSection onAddCar={() => setIsSheetCarOpen(true)} onEditCar={handleEditCar} onCarChange={handleCarChange}/>
        </View>

        <View className="px-6 mt-12">
          <View>
            <HeaderSection
              name="My Documents"
              onAdd={() => setIsSheetDocOpen(true)}
            />

            {loadingDocs ? (
              <ActivityIndicator size="small" color="#F97316" style={{ marginTop: 16 }} />
            ) : (
              documents.map((doc) => (
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
              ))
            )}
            {documents.length > 0 && !loadingDocs && (
              <Pressable 
                onPress={handleViewAllDocuments}
                className="mt-4 bg-white py-2 px-6 rounded-full self-center shadow-sm flex-row items-center justify-center border border-gray-100"
              >
                <Text className="text-orange-500 font-medium text-sm">
                  Vezi toate documentele
                </Text>
              </Pressable>
            )}
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
        key={editingCarData ? `car-${editingCarData.brandId}-${editingCarData.modelId}-${Date.now()}` : "car-add"}
        isVisible={isSheetCarOpen}
        initialData={editingCarData}
        onClose={() => {
          setIsSheetCarOpen(false);
          setEditingCarData(null);
        }}
      />

      <AddDocuments
        key={editingDocData ? `doc-${editingDocData.documentCategoryId}-${Date.now()}` : "doc-add"}
        isVisible={isSheetDocOpen}
        initialData={editingDocData}
        carId={currentCarId}
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