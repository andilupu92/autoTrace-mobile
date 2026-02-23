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
    if (fontsLoaded && !isLoading) {
      const hideSplash = async () => {
        await SplashScreen.hideAsync();
      };
      hideSplash();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <GluestackUIProvider mode={(colorScheme ?? "light") as "light" | "dark"}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
