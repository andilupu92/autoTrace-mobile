import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "../page/auth/login";
import HomeScreen from "../page/home/home";
import ForgotPasswordScreen from '../page/auth/forgotPassword';
import SignUpScreen from '../page/auth/signUp';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
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
          {/*</>
        )}*/}
        </Stack.Navigator>
    );
}