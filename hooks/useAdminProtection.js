import { useAuth } from "@/context/AuthContext";

export function useAdminProtection() {
  const { user, userType, loading, appUser } = useAuth();

  if (loading) {
    return {
      isLoading: true,
      isAuthorized: false,
      shouldRedirectTo: null,
    };
  }

  if (!user) {
    return {
      isLoading: false,
      isAuthorized: false,
      shouldRedirectTo: "/(auth)/login",
    };
  }

  if (!appUser) {
    return {
      isLoading: false,
      isAuthorized: false,
      shouldRedirectTo: "/(auth)/login",
    };
  }

  if (userType !== "admin") {
    const destination =
      userType === "new_user" ? "/(onboarding)" : "/(member)/(tabs)/dashboard";
    return {
      isLoading: false,
      isAuthorized: false,
      shouldRedirectTo: destination,
    };
  }

  return {
    isLoading: false,
    isAuthorized: true,
    shouldRedirectTo: null,
  };
}
