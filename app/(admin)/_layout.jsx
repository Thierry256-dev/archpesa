import { useAdminProtection } from "@/hooks/useAdminProtection";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AdminLayout() {
  const { isLoading, isAuthorized, shouldRedirectTo } = useAdminProtection();

  // Show loading while authentication is resolving
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-arch-blue">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Redirect if unauthorized
  if (!isAuthorized && shouldRedirectTo) {
    return <Redirect href={shouldRedirectTo} />;
  }

  // User is authenticated and verified as admin - render admin layout
  return <Stack screenOptions={{ headerShown: false }} />;
}
