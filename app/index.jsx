import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

export default function Index() {
  const { user, appUser, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-primary">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Logged in but not yet approved into users table
  if (!appUser) {
    return <Redirect href="/(member)/(tabs)/dashboard" />;
  }

  if (isAdmin) {
    return <Redirect href="/(admin)/(tabs)/dashboard" />;
  }

  return <Redirect href="/(member)/(tabs)/dashboard" />;
}
