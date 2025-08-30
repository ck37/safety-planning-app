import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StyleSheet, Platform } from "react-native";
import { SafetyPlanProvider } from "@/providers/SafetyPlanProvider";
import { MoodTrackingProvider } from "@/providers/MoodTrackingProvider";
import { SmartNotificationsProvider } from "@/providers/SmartNotificationsProvider";

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
        <Stack.Screen 
          name="notification-settings" 
          options={{ 
            title: "Smart Notifications",
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
          <MoodTrackingProvider>
            <SmartNotificationsProvider>
              <View style={styles.rootWrapper}>
                <RootLayoutNav />
              </View>
            </SmartNotificationsProvider>
          </MoodTrackingProvider>
        </SafetyPlanProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  rootWrapper: {
    maxWidth: Platform.OS === 'web' ? 800 : undefined,
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
});
