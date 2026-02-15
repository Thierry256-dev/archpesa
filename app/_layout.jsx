import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Platform, Text, View } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("@/public/service-worker.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }, []);
  return (
    <ThemeProvider initialMode="light">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <View className="flex-1 bg-arch-blue items-center justify-center">
            <View className="w-full md:max-w-[430px] h-full md:h-[90vh] md:max-h-[850px] bg-arch-blue md:rounded-3xl md:shadow-2xl overflow-hidden">
              <ErrorBoundary
                fallback={
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-center">Oops!!</Text>
                    <Text className="text-white text-center">
                      Something went wrong
                    </Text>
                  </View>
                }
              >
                <Slot />
              </ErrorBoundary>
            </View>
          </View>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
