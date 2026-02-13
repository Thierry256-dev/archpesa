import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Dimensions, Platform } from "react-native";

export default function MemberTabsLayout() {
  const { theme } = useTheme();
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  const MAX_WIDTH = 448;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.white,
        tabBarStyle: {
          backgroundColor: theme.primary,
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
          borderRadius: 35,
          elevation: 5,
          shadowColor: theme.black,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="transact"
        options={{
          title: "Transact",
          tabBarIcon: ({ color }) => (
            <Ionicons name="repeat" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="savings"
        options={{
          title: "Savings",
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
