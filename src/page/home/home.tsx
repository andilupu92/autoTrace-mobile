import { TouchableOpacity } from 'react-native';
import { 
  Box, 
  VStack, 
  Text,
  Avatar, 
  AvatarImage, 
  AvatarFallbackText,
  Center 
} from '@gluestack-ui/themed';
import { Heading } from '@/components/ui/heading';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

export default function HomeScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const openUserDetails = () => {
        navigation.navigate('UserDetails');
    };
    
  return (
    <Box className="flex-1 bg-white dark:bg-slate-950">
      
      {/* HEADER */}
      <Box className="px-8 pt-16 pb-6 flex-row justify-between items-center" style={{ zIndex: 10 }}>
        <VStack className="flex-1">
            <Heading className="text-black dark:text-white text-2xl font-light">
                Hello, <Text className="font-bold">Andrei</Text>
            </Heading>
        </VStack>
        
       {/* RIGHT PART: Profile Icon */}
        <TouchableOpacity activeOpacity={0.7} onPress={openUserDetails}>
            <Box className="relative">
            
                <Avatar className="h-14 w-14 bg-violet-600 rounded-full border-2 border-white dark:border-slate-950 shadow-xl shadow-violet-500/20 items-center justify-center overflow-hidden">
                    
                    <AvatarFallbackText className="text-white font-medium">
                        AD
                    </AvatarFallbackText>
                    
                    <AvatarImage
                        source={{
                            uri: "https://i.pravatar.cc/300",
                        }}
                        className="w-full h-full absolute inset-0"
                        alt="User Avatar"
                    />
                </Avatar>

                <Box className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
            </Box>
        </TouchableOpacity>
      </Box>

      <VStack 
        className="flex-1 px-8 pt-12 mt-4 bg-gray-50 dark:bg-slate-900 rounded-t-[35px] shadow-sm"
        style={{ zIndex: 20 }}
      >
         
         <Center className="flex-1 pb-20">
            <Text className="text-gray-500 dark:text-gray-400 text-lg">
                This is the Home Screen. Tap on the avatar to view user details.
            </Text>
         </Center>

      </VStack>
    </Box>
  );
}