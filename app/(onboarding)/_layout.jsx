import { RegistrationProvider } from "@/context/RegistrationContext";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <RegistrationProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RegistrationProvider>
  );
}
