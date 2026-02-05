import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "../page/login";

export type RootStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
}