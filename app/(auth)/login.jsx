import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("admin");

  return (
    <View className="flex-1 bg-brand-primary px-6 justify-center">
      {/* Centered Content Wrapper */}
      <View>
        {/* Logo + App Name */}
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/images/icon.png")}
            className="w-20 h-20 mb-4"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold">
            <Text className="text-white">Arch</Text>
            <Text className="text-brand-secondary">Pesa</Text>
          </Text>
          <Text className="text-sm text-gray-300 mt-1">
            Secure. Transparent. Simple.
          </Text>
        </View>

        {/* Login Type Tabs */}
        <View className="flex-row bg-white/10 rounded-xl mb-6 overflow-hidden">
          <Pressable
            className={`flex-1 py-3 ${activeTab === "admin" ? "bg-white" : ""}`}
            onPress={() => setActiveTab("admin")}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "admin" ? "text-brand-primary" : "text-gray-300"
              }`}
            >
              Admin Login
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 py-3 ${
              activeTab === "member" ? "bg-white" : ""
            }`}
            onPress={() => setActiveTab("member")}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "member" ? "text-[#104066]" : "text-gray-300"
              }`}
            >
              Member Login
            </Text>
          </Pressable>
        </View>

        {/* Form Card */}
        <View className="bg-white p-5 rounded-2xl mb-6 shadow-lg">
          {/* Phone Number */}
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-1 mb-4">
            <Ionicons name="call-outline" size={18} color="#6B7280" />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              className="ml-3 flex-1 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* PIN */}
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-1">
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
            <TextInput
              placeholder="PIN"
              secureTextEntry
              className="ml-3 flex-1 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Sign In Button */}
        <Pressable
          className="bg-brand-secondary py-4 rounded-xl mb-4"
          onPress={() => {
            activeTab === "admin"
              ? router.replace("/(admin)/(tabs)/dashboard")
              : router.replace("/(member)/(tabs)/dashboard");
          }}
        >
          <Text className="text-white text-center font-semibold text-base">
            Sign In
          </Text>
        </Pressable>

        {/* Secondary Action */}
        <Pressable
          className="mb-6"
          onPress={() => router.push("/(auth)/register")}
        >
          <Text className="text-center text-white/80 font-semibold">
            Don’t have an account? Register
          </Text>
        </Pressable>

        {/* Footer Trust Indicator */}
        <View className="items-center">
          <View className="flex-row items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#D1D5DB"
            />
            <Text className="text-xs text-gray-300 ml-1">
              Secured by ArchPesa
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
