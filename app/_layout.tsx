import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
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
    // Debugging: log runtime location info on web to diagnose routing issues
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      console.log('EXPO_ROUTER_DEBUG location.href=', window.location.href);
      console.log('EXPO_ROUTER_DEBUG location.pathname=', window.location.pathname);
      console.log('EXPO_ROUTER_DEBUG document.baseURI=', document.baseURI);
      
      // If the app is hosted under a GitHub Pages subpath, normalize the pathname
      try {
        const base = '/suicide-safety-planning-app';
        const p = window.location.pathname;
        if (p.startsWith(base)) {
          const newPath = p.slice(base.length) || '/';
          // Use expo-router to replace the route so the router sees the normalized path
          // Cast to any to satisfy TypeScript's strict route path types
          // @ts-ignore
          router.replace((newPath + window.location.search + window.location.hash) as any);
          console.log('EXPO_ROUTER_DEBUG normalized path to', newPath);
        }
      } catch (e) {
        console.warn('EXPO_ROUTER_DEBUG normalize failed', e);
      }
    }
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
