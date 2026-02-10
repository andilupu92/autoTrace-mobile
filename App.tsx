import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { useColorScheme } from "nativewind";
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import '@/global.css';
import { useEffect } from "react";
import { useAuthStore } from "./src/store/authStore";
import { View, ActivityIndicator } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { colorScheme } = useColorScheme();
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [fontsLoaded] = useFonts({
    'Inter-SemiBold': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Italic': require('./assets/fonts/Inter_18pt-Italic.ttf'),
  });

  useEffect(() => {
    initialize();
  }, []);
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <GluestackUIProvider mode={(colorScheme ?? "light") as "light" | "dark"}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </GluestackUIProvider>
      )}
    </>
  );
}
