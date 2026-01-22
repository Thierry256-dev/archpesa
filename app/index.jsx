import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

export default function Index() {
  const { user, loading, isAdmin, isNewUser, isPendingApplicant } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-arch-blue">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Brand new user → onboarding
  if (isNewUser) {
    return <Redirect href="/(onboarding)" />;
  }

  // Pending or rejected applicant → limited dashboard
  if (isPendingApplicant) {
    return <Redirect href="/(member)/(tabs)/dashboard" />;
  }

  if (isAdmin) {
    return <Redirect href="/(admin)/(tabs)/dashboard" />;
  }

  return <Redirect href="/(member)/(tabs)/dashboard" />;
}
