import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "../page/auth/login";
import HomeScreen from "../page/home/homeScreen";
import ForgotPasswordScreen from '../page/auth/forgotPassword';
import SignUpScreen from '../page/auth/signUp';
import UserDetailsScreen from '../page/home/profile/userDetails';
import AllDocumentsScreen from '../page/home/documents/allDocuments';
import AllExpensesScreen from '../page/home/expenses/allExpenses';

type Document = {
  id: number;
  documentCategoryId: number;
  documentCategoryName: string;
  expiryDate: string;
  daysRemaining: number;
  documentCategoryIconName: string;
  documentCategoryIconLibrary: string;
};

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  UserDetails: undefined;
  AllDocuments: { documents: Document[], currentCarId: number };
  AllExpenses: { carId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
//const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

export default function AppNavigator() {
    return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        {/*{isAuthenticated ? (
          <>*/}
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          {/*</>
          ) : (
          <>*/}
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="UserDetails" component={UserDetailsScreen} options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }} />
            <Stack.Screen name="AllDocuments" component={AllDocumentsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AllExpenses" component={AllExpensesScreen} options={{ headerShown: false }}/>
          {/*</>
        )}*/}
        </Stack.Navigator>
    );
}