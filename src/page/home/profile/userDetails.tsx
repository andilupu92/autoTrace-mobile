import { 
  Box,
  HStack,
  Icon,
  Pressable,
  CloseIcon
} from '@gluestack-ui/themed';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { Platform, StyleSheet } from 'react-native';

export default function UserDetailsScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <Box className="flex-1 bg-transparent">

            {/* 1. Backdrop Blur */}
            <BlurView 
                intensity={Platform.OS === "ios" ? 30 : 80}
                          tint="light"
                          style={StyleSheet.absoluteFillObject}
                          experimentalBlurMethod="dimezisBlurView"
            />

            {/* 2. Close Button */}
            <HStack className="justify-end mb-4">
                <Pressable onPress={() => navigation.goBack()}>
                <Icon as={CloseIcon} color="black" className="h-6 w-6" />
                </Pressable>
            </HStack>

    </Box>
    );
}