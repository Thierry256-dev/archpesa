import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

export default function Index() {
  const { user, userType, loading } = useAuth();

  // Still resolving auth / context
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-arch-blue">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Not logged in
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!userType) {
    return <Redirect href="/(onboarding)" />;
  }

  if (!userType) {
    return <Redirect href="/(auth)/login" />;
  }

  // Supabase-driven routing
  switch (userType) {
    case "pending_applicant":
      return <Redirect href="/(member)/(tabs)/dashboard" />;

    case "admin":
      return <Redirect href="/(admin)/(tabs)/dashboard" />;

    case "member":
      return <Redirect href="/(member)/(tabs)/dashboard" />;

    default:
      // Safety net — should never happen
      return <Redirect href="/(auth)/login" />;
  }
}
