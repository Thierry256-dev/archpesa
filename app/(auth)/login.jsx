import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { rememberMe, setRememberMe } = useAuth();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      className="flex-1 bg-arch-blue justify-center relative"
    >
      <View className="absolute top-0 left-0 w-full h-1/2 rounded-b-[60px]" />

      <View className="px-6 z-10">
        {/* Header Section */}
        <View className="items-center mb-10">
          <View className="rounded-3xl mb-4 shadow-lg">
            <Image
              source={require("../../assets/images/icon.png")}
              style={{
                width: 140,
                height: 140,
              }}
              resizeMode="cover"
            />
          </View>
          <Text className="text-4xl font-extrabold tracking-tight mb-1">
            <Text className="text-white">Arch</Text>
            <Text className="text-brand-secondary">Pesa</Text>
          </Text>
          <Text className="text-base text-gray-300 font-medium tracking-wide">
            Welcome back
          </Text>
        </View>

        {/* Main Card */}
        <View className="bg-white px-6 py-8 rounded-[32px] shadow-2xl shadow-black/20">
          <Text className="text-gray-900 font-bold text-xl mb-6">Sign In</Text>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-2">
              Email Address
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 transition-colors">
              <Ionicons name="mail-outline" size={20} color="#64748B" />
              <TextInput
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                className="ml-3 flex-1 text-gray-900 font-medium text-base"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-2">
              Password
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" />

              <TextInput
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                className="ml-3 flex-1 text-gray-900 font-medium text-base h-full"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />

              <Pressable
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                className="p-2"
                hitSlop={10}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#64748B"
                />
              </Pressable>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 p-3 rounded-xl mb-4 flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-red-600 text-sm font-medium ml-2 flex-1">
                {error}
              </Text>
            </View>
          ) : null}

          {/* Remember Me & Forgot Password */}
          <View className="flex-row items-center justify-between mb-8">
            <Pressable
              className="flex-row items-center py-2"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Ionicons
                name={rememberMe ? "checkbox" : "square-outline"}
                size={22}
                color={rememberMe ? "#0F172A" : "#94A3B8"} // Assuming #0F172A is close to primary
              />
              <Text className="ml-2 text-gray-600 font-medium text-sm">
                Remember me
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
              <Text className="text-brand-secondary font-semibold text-sm">
                Forgot Password?
              </Text>
            </Pressable>
          </View>

          {/* Submit Button */}
          <Pressable
            className={`h-14 rounded-2xl items-center justify-center shadow-lg shadow-brand-secondary/30 ${
              loading ? "bg-gray-300" : "bg-brand-secondary"
            }`}
            disabled={loading}
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-lg mr-2">
                  Sign In
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </View>
            )}
          </Pressable>
        </View>

        {/* Footer Actions */}
        <View className="mt-8 items-center gap-y-6">
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            className="py-2 px-4"
          >
            <Text className="text-center text-gray-300 text-base">
              New to ArchPesa?{" "}
              <Text className="text-white font-bold underline decoration-brand-secondary">
                Create Account
              </Text>
            </Text>
          </Pressable>

          <View className="flex-row items-center opacity-60">
            <Ionicons name="shield-checkmark" size={14} color="#fff" />
            <Text className="text-[10px] text-white ml-1 font-medium tracking-widest uppercase">
              secured by ArchPesa
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
