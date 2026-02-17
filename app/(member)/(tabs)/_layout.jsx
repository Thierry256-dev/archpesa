import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MemberTabsLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  const MAX_WIDTH = 448;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.white,
        tabBarInactiveTintColor: theme.gray400,
        tabBarStyle: {
          backgroundColor: theme.primary,
          height: 60,
          alignSelf: "center",
          marginBottom: insets.bottom + 10,
          marginHorizontal: 20,
          width: isWeb ? Math.min(width, MAX_WIDTH) - 40 : "90%",
          maxWidth: MAX_WIDTH,
          borderRadius: 35,
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: theme.black,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginBottom: 8,
        },

        tabBarIconStyle: {
          marginTop: 8,
        },

        tabBarItemStyle: {
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
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
