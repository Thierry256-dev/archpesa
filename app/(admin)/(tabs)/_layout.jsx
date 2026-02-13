import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Dimensions, Platform } from "react-native";

export default function AdminTabsLayout() {
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  const MAX_WIDTH = 448;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#07193f",
          height: 60,
          position: "absolute",
          bottom: 20,
          left: isWeb ? "55%" : 20,
          right: isWeb ? "auto" : 20,
          transform: isWeb
            ? [{ translateX: -Math.min(width, MAX_WIDTH) / 2 }]
            : [],

          width: isWeb ? Math.min(width, MAX_WIDTH) - 40 : undefined,
          maxWidth: MAX_WIDTH,
          alignSelf: "center",

          borderRadius: 25,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          borderTopWidth: 0,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="members"
        options={{
          title: "Members",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ledger"
        options={{
          title: "Ledger",
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="loans"
        options={{
          title: "Loans",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cash-outline" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
