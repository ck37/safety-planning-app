import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafetyPlanProvider } from "@/providers/SafetyPlanProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="edit-plan" 
        options={{ 
          title: "Edit Safety Plan",
          presentation: "modal",
          headerStyle: {
            backgroundColor: '#6B46C1',
          },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafetyPlanProvider>
          <RootLayoutNav />
        </SafetyPlanProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
