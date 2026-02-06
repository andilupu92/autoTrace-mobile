import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { useColorScheme } from "nativewind";
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import '@/global.css';
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { colorScheme } = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Inter-SemiBold': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Italic': require('./assets/fonts/Inter_18pt-Italic.ttf'),
  });
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
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
