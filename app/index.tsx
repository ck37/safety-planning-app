import { Redirect } from "expo-router";

export default function Index() {
  // Ensure "/" resolves to the Tabs layout, which shows the Home tab by default.
  return <Redirect href="/(tabs)/(home)" />;
}
