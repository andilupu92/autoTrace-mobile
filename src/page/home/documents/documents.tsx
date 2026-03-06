import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import { View, Pressable, Alert, Modal } from "react-native";
import { Text } from "@/components/ui/text";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";

export default function PremiumDocumentCard({
  name,
  expiryDate,
  daysRemaining,
  totalDays = 30,
  onEdit,
  onDelete,
}: {
  name: string;
  expiryDate: Date;
  daysRemaining: number;
  totalDays?: number;
  onEdit?: (data: { name: string; expiryDate: Date }) => void;
  onDelete?: () => void;
}) {
  const progress = 1 - daysRemaining / totalDays;
  const progressWidth = useSharedValue(0);
  const pulse = useSharedValue(1);

  const swipeableRef = useRef<Swipeable>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const kebabRef = useRef<View>(null);

  const openMenu = () => {
    kebabRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({
        top: y + height + 4,
        right: 16,
      });
      setMenuVisible(true);
    });
  };

  useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 800 });

    if (daysRemaining <= 3) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 900 }),
          withTiming(1, { duration: 900 })
        ),
        -1,
        true
      );
    }
  }, []);

  const animatedProgress = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const getColors = () => {
    if (daysRemaining <= 3)
      return { text: "text-red-600", badgeBg: "bg-red-50", progress: "#DC2626" };
    if (daysRemaining <= 10)
      return { text: "text-amber-600", badgeBg: "bg-amber-50", progress: "#F59E0B" };
    return { text: "text-emerald-600", badgeBg: "bg-emerald-50", progress: "#10B981" };
  };

  const colors = getColors();

  const handleEdit = () => {
    swipeableRef.current?.close();
    setMenuVisible(false);
    onEdit?.({ name, expiryDate });
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    setMenuVisible(false);
    Alert.alert(
      "Delete Document",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    );
  };

  const renderRightActions = () => (
    <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
      <Pressable
        onPress={handleEdit}
        style={{
          backgroundColor: "#F5A623",
          width: 64,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
          marginRight: 6,
        }}
      >
        <Ionicons name="pencil" size={18} color="white" />
        <Text style={{ color: "white", fontSize: 11, fontWeight: "600", marginTop: 4 }}>
          Edit
        </Text>
      </Pressable>

      <Pressable
        onPress={handleDelete}
        style={{
          backgroundColor: "#FF3B30",
          width: 64,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
        }}
      >
        <Ionicons name="trash-outline" size={18} color="white" />
        <Text style={{ color: "white", fontSize: 11, fontWeight: "600", marginTop: 4 }}>
          Delete
        </Text>
      </Pressable>
    </View>
  );

  return (
    <Animated.View style={[animatedPulse]} className="mb-4">
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        onSwipeableOpen={() => setMenuVisible(false)}
      >
        <View style={{ backgroundColor: "white", borderRadius: 20, padding: 18 }}>

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[15px] font-semibold text-gray-800">
              {name}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View className={`${colors.badgeBg} px-3 py-1 rounded-full`}>
                <Text className={`text-[12px] font-bold ${colors.text}`}>
                  {daysRemaining} days
                </Text>
              </View>

              <Pressable
                ref={kebabRef as any}
                onPress={openMenu}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="ellipsis-vertical" size={16} color="#AAAAAA" />
              </Pressable>
            </View>
          </View>

          {/* Progress Track */}
          <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <Animated.View
              style={[
                animatedProgress,
                { height: 8, backgroundColor: colors.progress, borderRadius: 999 },
              ]}
            />
          </View>

        </View>
      </Swipeable>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={{
              position: "absolute",
              top: menuPosition.top,
              right: menuPosition.right,
              backgroundColor: "white",
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 8,
              minWidth: 150,
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={handleEdit}
              style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}
            >
              <Ionicons name="pencil-outline" size={16} color="#F5A623" />
              <Text style={{ fontSize: 13, fontWeight: "500", color: "#374151" }}>
                Edit Document
              </Text>
            </Pressable>

            <View style={{ height: 0.5, backgroundColor: "#F3F4F6", marginHorizontal: 12 }} />

            <Pressable
              onPress={handleDelete}
              style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
              <Text style={{ fontSize: 13, fontWeight: "500", color: "#EF4444" }}>
                Delete
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

    </Animated.View>
  );
}