import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "../page/login";
import HomeScreen from "../page/home";
import ForgotPasswordScreen from '../page/forgotPassword';
import SignUpScreen from '../page/signUp';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    );
}