import { Text } from "@/components/ui/text";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

export default function Car({
  name,
  km,
  onEdit,
}: {
  name: string;
  km: number;
  onEdit?: () => void;
}) {
  return (
    <View className="items-center" style={{ marginTop: -25 }}>
      <TouchableOpacity 
        activeOpacity={1}
        onPress={onEdit}
        className="w-20 h-20 rounded-full items-center justify-center bg-white"
        style={
          { 
            borderColor: '#E5E7EB',
            borderTopColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
          } 
        }
      >
        {/* Edit button */}
        <View 
          style={{ 
            position: 'absolute', 
            top: 7,
            right: 7,
            padding: 4,
            opacity: 0.2,
          }}
        >
          <Ionicons name="pencil" size={44} color="#9CA3AF" />
        </View>

        <Text className={`font-bold text-center px-1 text-orange-500 text-[11px]`}>
          {name}
        </Text>
      </TouchableOpacity>
      
      <Text className={`text-[10px] font-bold uppercase mt-3 tracking-tighter text-orange-400`}>
        {km} Km
      </Text>
    </View>
  );
}