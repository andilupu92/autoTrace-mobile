import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { View, Switch, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from 'react';
import {
  User, MessageCircle, Bug, MessageSquare,
  Info, LogOut, ChevronRight, Moon, Mail, Camera,
} from 'lucide-react-native';

export default function UserDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const SectionLabel = ({ label }: { label: string }) => (
    <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-widest px-1 mb-2 mt-5">
      {label}
    </Text>
  );

  const MenuButton = ({
    icon: IconComp, label, onPress, rightElement, isRed = false,
  }: {
    icon: any; label: string; onPress?: () => void;
    rightElement?: React.ReactNode; isRed?: boolean;
  }) => (
    <Pressable onPress={onPress} className="bg-white rounded-2xl border border-black/[0.06] active:bg-neutral-50">
      <View className="flex-row items-center justify-between px-4 h-14">
        <View className="flex-row items-center gap-3">
          <View className={`w-9 h-9 rounded-xl items-center justify-center ${isRed ? 'bg-red-500/10' : 'bg-neutral-100'}`}>
            <IconComp color={isRed ? '#dd4444' : '#666'} size={18} strokeWidth={1.7} />
          </View>
          <Text className={`text-[15px] font-medium ${isRed ? 'text-red-500' : 'text-neutral-800'}`}>
            {label}
          </Text>
        </View>
        {rightElement !== undefined
          ? rightElement
          : <ChevronRight color="#ccc" size={16} strokeWidth={2.5} />}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1">

        {/* ── Header nou ── */}
        <View className="px-6 pt-5"

        >
          {/* Close button */}
          <View className="flex-row justify-end mb-4">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-9 h-9 rounded-full items-center justify-center active:opacity-60"
              style={{ backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FED7AA" }}
            >
              <Ionicons name="close" size={18} color="#F97316" />
            </Pressable>
          </View>

          {/* Avatar + info */}
          <View className="items-center">

            {/* Avatar cu ring portocaliu și buton cameră */}
            <View className="mb-4">
              <View
                className="w-24 h-24 rounded-full items-center justify-center"
                style={{
                  borderWidth: 3,
                  borderColor: "#FED7AA",
                  backgroundColor: "#FFF7ED",
                }}
              >
                <User color="#F97316" size={40} strokeWidth={1.4} />
              </View>

              {/* Buton cameră – colț dreapta-jos */}
              <Pressable
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full items-center justify-center active:opacity-70"
                style={{
                  backgroundColor: "#F97316",
                  borderWidth: 2,
                  borderColor: "#fff",
                  shadowColor: "#F97316",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Camera size={13} color="#fff" strokeWidth={2} />
              </Pressable>
            </View>

            {/* Nume */}
            <Text className="text-[22px] font-bold text-slate-800 tracking-tight mb-0.5">
              Andrei
            </Text>

            {/* Email pill */}
            <View
              className="flex-row items-center gap-1.5 px-3 py-1 rounded-full mt-1"
              style={{ backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FED7AA" }}
            >
              <Mail size={11} color="#F97316" strokeWidth={2} />
              <Text className="text-xs font-medium" style={{ color: "#FB923C" }}>
                andrei@example.com
              </Text>
            </View>
          </View>

          {/* ── Stats rapide ── */}
          <View className="flex-row gap-3 mt-5">
            {[
              { label: "Documente", value: "6" },
              { label: "Cheltuieli", value: "4" },
              { label: "Alerte", value: "2" },
            ].map((stat) => (
              <View
                key={stat.label}
                className="flex-1 items-center py-3 rounded-2xl"
                style={{ backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FED7AA" }}
              >
                <Text className="text-[20px] font-extrabold" style={{ color: "#1E293B" }}>
                  {stat.value}
                </Text>
                <Text className="text-[10px] font-semibold tracking-wide mt-0.5" style={{ color: "#FB923C" }}>
                  {stat.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Meniu ── */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-12"
          showsVerticalScrollIndicator={false}
        >
          <SectionLabel label="Account" />
          <View className="gap-2.5">
            <MenuButton icon={User} label="My Account" onPress={() => {}} />
            <MenuButton icon={MessageCircle} label="Contact Us" onPress={() => {}} />
          </View>

          <SectionLabel label="Preferences" />
          <View className="gap-2.5">
            <MenuButton
              icon={Moon}
              label="Dark Mode"
              onPress={() => setIsDarkMode(p => !p)}
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: '#e0e0e0', true: '#F97316' }}
                  thumbColor="#fff"
                  ios_backgroundColor="#e0e0e0"
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
              }
            />
          </View>

          <SectionLabel label="Support" />
          <View className="gap-2.5">
            <MenuButton icon={Bug} label="Report a Bug" onPress={() => {}} />
            <MenuButton icon={MessageSquare} label="Send Feedback" onPress={() => {}} />
            <MenuButton icon={Info} label="About App" onPress={() => {}} />
          </View>

          <View className="mt-8">
            <MenuButton icon={LogOut} label="Log Out" isRed onPress={() => {}} rightElement={<View />} />
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}