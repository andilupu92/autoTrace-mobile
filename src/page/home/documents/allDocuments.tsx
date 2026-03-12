import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import DocumentCard from "../components/documents/document"; // ajustează calea

export default function AllDocumentsScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header simplu cu buton de Back */}
      <View className="flex-row items-center px-6 pt-12 pb-4 bg-white shadow-sm">
        <Pressable onPress={() => navigation.goBack()} className="mr-4">
          <Text className="text-orange-500 font-bold text-lg">{"< Înapoi"}</Text>
        </Pressable>
        <Text className="text-xl font-semibold text-gray-800">Toate Documentele</Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Aici vei randa lista completă cu map() în viitor */}
        {/* <DocumentCard name="RCA Insurance" ... /> */}
        {/* <DocumentCard name="ITP Inspection" ... /> */}
        {/* <DocumentCard name="Road Tax" ... /> */}
        {/* <DocumentCard name="Rovinieta" ... /> */}
        {/* <DocumentCard name="Asigurare Casco" ... /> */}
      </ScrollView>
    </View>
  );
}