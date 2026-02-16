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
import { RootStackParamList } from '../../navigation/AppNavigator';

export default function UserDetailsScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <Box className="flex-1 bg-black/85">

            {/* 1. Backdrop Blur */}
            <BlurView 
                intensity={95} 
                tint="dark"
                className="absolute inset-0"
            />

            {/* 2. Close Button */}
            <HStack className="justify-end mb-4">
                <Pressable onPress={() => navigation.goBack()}>
                <Icon as={CloseIcon} color="white" className="h-6 w-6" />
                </Pressable>
            </HStack>

    </Box>
    );
}