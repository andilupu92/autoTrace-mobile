import { KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Box } from '@/components/ui/box';
import WelcomeCard from './WelcomeCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Box className="flex-1 bg-white dark:bg-slate-950">

      {/* HEADER */}
      <Box style={{ zIndex: 10 }}>
        <WelcomeCard primaryTitle="Create"
                     secondaryTitle="Account"   
                     contain="Please sign Up to continue"
                     showBackButton={true} 
                     onBackPress={() => navigation.goBack()}/>
      </Box>

      <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="flex-1"
            >




      </KeyboardAvoidingView>
    </Box>
  );
}