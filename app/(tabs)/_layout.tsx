import { Tabs } from "expo-router";
import { Heart, Phone, BookOpen } from "lucide-react-native";
import React from "react";
import { Platform, View, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#6B46C1',
            tabBarInactiveTintColor: '#9CA3AF',
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#F3F4F6',
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
              maxWidth: Platform.OS === 'web' ? 800 : '100%',
              alignSelf: 'center',
              width: '100%',
            },
          }}
        >
          <Tabs.Screen
            name="(home)"
            options={{
              title: "My Plan",
              tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="crisis"
            options={{
              title: "Crisis Help",
              tabBarIcon: ({ color }) => <Phone size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="resources"
            options={{
              title: "Resources",
              tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentWrapper: {
    flex: 1,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  } as any,
});
