import { RegistrationProvider } from "@/context/RegistrationContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function OnboardingLayout() {
  return (
    <RegistrationProvider>
      <View className="flex-1 bg-slate-100 items-center justify-center">
        <View className="w-full max-w-md h-full md:h-[90vh] md:max-h-[850px] bg-white md:rounded-3xl md:shadow-2xl overflow-hidden">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>
    </RegistrationProvider>
  );
}
