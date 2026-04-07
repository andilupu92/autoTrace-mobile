// src/utils/DynamicIcon.tsx
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  library: string;
  name: string;
  size?: number;
  color?: string;
};

export default function DynamicIcon({ library, name, size, color }: Props) {
  switch (library) {
    case "FontAwesome5":
      return <FontAwesome5 name={name as any} size={size} color={color} />;
    case "MaterialIcons":
      return <MaterialIcons name={name as any} size={size} color={color} />;
    case "Ionicons":
      return <Ionicons name={name as any} size={size} color={color} />;
    default:
      return null;
  }
}