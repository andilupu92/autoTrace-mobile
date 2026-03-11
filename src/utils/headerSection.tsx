import { TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type HeaderSectionProps = {
  onAdd: () => void;
  name: string;
};

export default function HeaderSection({ onAdd, name }: HeaderSectionProps) {
  return (
    <View className="flex-row justify-between items-center mb-4 px-1">
      
      {/* Title */}
      <Text className="text-[18px] font-bold text-gray-800 tracking-tight">
        {name}
      </Text>

      {/* Add Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onAdd}
        className="bg-black w-6 h-6 rounded-full items-center justify-center"
      >
        <Plus size={15} color="white" />
      </TouchableOpacity>
    </View>
  );
}