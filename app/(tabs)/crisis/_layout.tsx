import { Stack } from "expo-router";

export default function CrisisLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Crisis Support",
          headerStyle: {
            backgroundColor: '#DC2626',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }} 
      />
    </Stack>
  );
}