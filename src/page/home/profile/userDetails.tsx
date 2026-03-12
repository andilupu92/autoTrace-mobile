import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { View, Switch, ScrollView, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  User,
  MessageCircle,
  Bug,
  MessageSquare,
  Info,
  LogOut,
  ChevronRight,
  Moon,
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
    icon: IconComp,
    label,
    onPress,
    rightElement,
    isRed = false,
  }: {
    icon: any;
    label: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    isRed?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl border border-black/[0.06] active:bg-neutral-50"
    >
      <View className="flex-row items-center justify-between px-4 h-14">
        <View className="flex-row items-center gap-3">
          <View className={`w-9 h-9 rounded-xl items-center justify-center ${isRed ? 'bg-red-500/10' : 'bg-neutral-100'}`}>
            <IconComp
              color={isRed ? '#dd4444' : '#666'}
              size={18}
              strokeWidth={1.7}
            />
          </View>
          <Text className={`text-[15px] font-medium ${isRed ? 'text-red-500' : 'text-neutral-800'}`}>
            {label}
          </Text>
        </View>
        {rightElement !== undefined
          ? rightElement
          : <ChevronRight color="#ccc" size={16} strokeWidth={2.5} />
        }
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-neutral-100">

      {/* Header gradient */}
      <LinearGradient
        colors={['#F5C97F', '#F0B05A', '#EDA882']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full pt-14 pb-16 px-5 rounded-b-[36px]"
      >
        {/* Close button */}
        <View className="flex-row justify-end mb-6">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-black/10 items-center justify-center active:bg-black/20"
          >
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Avatar */}
        <View className="items-center">
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.18,
              shadowRadius: 14,
              elevation: 8,
              backgroundColor: 'white',
            }}
          >
            <View className="w-[84px] h-[84px] rounded-full bg-neutral-100 items-center justify-center border-2 border-white">
              <User color="#bbb" size={42} strokeWidth={1.4} />
            </View>
          </View>
          <Text className="text-[22px] font-bold text-white tracking-tight">Andrei</Text>
          <Text className="text-sm text-white/70 mt-0.5">andrei@example.com</Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Account section */}
        <SectionLabel label="Account" />
        <View className="gap-2.5">
          <MenuButton icon={User} label="My Account" onPress={() => {}} />
          <MenuButton icon={MessageCircle} label="Contact Us" onPress={() => {}} />
        </View>

        {/* Preferences section */}
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
                trackColor={{ false: '#e0e0e0', true: '#1a1a1a' }}
                thumbColor="#fff"
                ios_backgroundColor="#e0e0e0"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            }
          />
        </View>

        {/* Support section */}
        <SectionLabel label="Support" />
        <View className="gap-2.5">
          <MenuButton icon={Bug} label="Report a Bug" onPress={() => {}} />
          <MenuButton icon={MessageSquare} label="Send Feedback" onPress={() => {}} />
          <MenuButton icon={Info} label="About App" onPress={() => {}} />
        </View>

        {/* Log Out */}
        <View className="mt-8">
          <MenuButton
            icon={LogOut}
            label="Log Out"
            isRed
            onPress={() => {}}
            rightElement={<View />}
          />
        </View>
      </ScrollView>

    </View>
  );
}