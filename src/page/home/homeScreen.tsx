import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { View } from "react-native";
import HeaderScreen from "./headerHome";
import CarsSection from "./cars/carsSection";
import HeaderSection from "./headerSection";
import PremiumDocumentCard from "./documents/documents";
import ExpensesChart from "./expensesChart";
import { useState } from "react";
import AddDocuments from "./documents/addDocuments";

export default function HomeScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openUserDetails = () => {
    navigation.navigate("UserDetails");
  };

  return (
    <View style={{ flex: 1 }}>

      <HeaderScreen openUserDetails={openUserDetails} />

      <ScrollView
        className="flex-1 bg-gray-150"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >

       <View className="mt-4">
          <CarsSection />
        </View>

        <View className="px-6">
          <View>
            <HeaderSection
              name="My Documents"
              onAdd={() => setIsSheetOpen(true)}
            />

            <PremiumDocumentCard name="RCA Insurance" daysRemaining={2} />
            <PremiumDocumentCard name="ITP Inspection" daysRemaining={7} />
            <PremiumDocumentCard name="Road Tax" daysRemaining={24} />
          </View>
        </View>

        <View className="px-6 mt-10">
          <HeaderSection
            name="My Expenses"
            onAdd={() => console.log("Add expense")}
          />
          <ExpensesChart />
        </View>
      </ScrollView>

      <AddDocuments
        isVisible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />

    </View>
  );
}