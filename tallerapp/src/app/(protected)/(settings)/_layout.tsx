import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="fourth"
        options={{
          title: "Cuarto",
          tabBarIcon: ({ color, size }) => ( <Ionicons name="settings-outline" size={size} color={color} /> )
        }}
      />
    </Tabs>
  );
}