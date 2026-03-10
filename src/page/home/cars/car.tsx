import { Text } from "@/components/ui/text";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

export default function Car({
  name,
  km,
  highlight = false,
}: {
  name: string;
  km: string;
  highlight?: boolean;
}) {
  return (
    <View className="items-center" style={!highlight ? { marginTop: -12 } : undefined}>
      <View 
        className="w-20 h-20 rounded-full items-center justify-center bg-white"
        style={
          highlight 
            ? { 
                borderWidth: 1.5, 
                borderColor: '#f97316',
                elevation: 6,
                shadowColor: '#f97316',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                position: 'relative', 
              }
            : { 
                borderColor: '#E5E7EB',
                borderTopColor: 'transparent',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
              } 
        }
      >
        {/* Edit button */}
        {highlight && (
          <TouchableOpacity 
            style={{ 
              position: 'absolute', 
              top: 7,
              right: 7,
              padding: 4,
              opacity: 0.3,
            }}
            onPress={() => console.log("open sheet")}
          >
            <Ionicons name="pencil" size={44} color="#9CA3AF" />
          </TouchableOpacity>
        )}

        <Text className={`font-bold text-center px-1 ${highlight ? "text-orange-500 text-[13px]" : "text-gray-400 text-[10px]"}`}>
          {name}
        </Text>
      </View>
      
      <Text className={`text-[10px] font-bold uppercase mt-3 tracking-tighter ${highlight ? "text-orange-400" : "text-gray-400"}`}>
        {km}
      </Text>
    </View>
  );
}