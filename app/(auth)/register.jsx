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
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getPasswordStrength = (password) => {
  if (password.length < 8) return "weak";
  if (!/[A-Za-z]/.test(password)) return "weak";
  if (!/[0-9]/.test(password)) return "weak";
  return "strong";
};

export default function Register() {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!fullName.trim()) {
      return setError("Full name is required.");
    }

    if (!email.includes("@")) {
      return setError("Valid email is required.");
    }

    if (getPasswordStrength(password) !== "strong") {
      return setError(
        "Password must be at least 8 characters and include letters and numbers.",
      );
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      setLoading(false);
      return setError(authError.message);
    }

    await supabase.auth.signOut();

    setLoading(false);

    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-arch-blue">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        className="flex-1 bg-arch-blue"
      >
        <ScrollView
          className="flex-1 w-full max-w-md mx-auto"
          contentContainerStyle={{ paddingVertical: 32, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-10">
            <View className="shadow-xl shadow-black/20 rounded-3xl backdrop-blur-md">
              <Image
                source={require("../../assets/images/icon.png")}
                style={{
                  width: 130,
                  height: 130,
                }}
                resizeMode="cover"
              />
            </View>
            <Text className="text-4xl font-extrabold tracking-tight mb-2">
              <Text className="text-white">Arch</Text>
              <Text className="text-brand-secondary">Pesa</Text>
            </Text>
            <Text className="text-base text-gray-300 font-medium tracking-wide">
              Secure. Transparent. Simple.
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-[32px] p-6 shadow-2xl shadow-black/20">
            {/* Member Details */}
            <Text className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">
              Create your account
            </Text>

            <Input
              icon="person-outline"
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />

            <Input
              icon="mail-outline"
              placeholder="Email Address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              icon="lock-closed-outline"
              placeholder="Password"
              secure
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordStrength(getPasswordStrength(text));
              }}
            />
            <Input
              icon="lock-closed-outline"
              placeholder="Confirm Password"
              secure
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {password.length < 6 && password !== "" ? (
              ""
            ) : (
              <View className="flex-row items-center justify-center mt-2">
                {password !== "" && (
                  <Ionicons
                    name={
                      passwordStrength === "strong"
                        ? "checkmark-circle"
                        : "alert-circle"
                    }
                    size={16}
                    color={
                      passwordStrength === "strong" ? "#16A34A" : "#EF4444"
                    }
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text
                  className={`text-xs font-medium ${
                    passwordStrength === "strong"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordStrength === "strong"
                    ? "Password strength: Strong"
                    : password !== ""
                      ? "Use 8+ chars with letters & numbers"
                      : ""}
                </Text>
              </View>
            )}

            {/* Error */}
            {error ? (
              <View className="bg-red-50 p-3 rounded-xl mt-4 border border-red-100 flex-row items-center">
                <Ionicons name="warning" size={20} color="#EF4444" />
                <Text className="text-red-600 text-sm font-medium ml-2 flex-1">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Submit */}
            <Pressable
              className={`h-14 rounded-2xl mt-8 flex-row items-center justify-center shadow-lg active:opacity-90 ${loading ? "bg-arch-green/70" : "bg-arch-green"}`}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-lg mr-2">
                    Create Account
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
              )}
            </Pressable>

            <View className="mt-6 flex-row justify-center items-center space-x-1">
              <Text className="text-gray-500">Already a member?</Text>
              <Pressable
                hitSlop={10}
                onPress={() => router.push("/(auth)/login")}
              >
                <Text className="text-brand-primary font-bold text-base ml-1">
                  Sign in
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center mt-8 mb-4">
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#9CA3AF"
            />
            <Text className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-wider">
              Secured by ArchPesa
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* Input Sub Component*/
function Input({
  icon,
  placeholder,
  secure,
  keyboardType,
  value,
  onChangeText,
  maxLength,
}) {
  const [passwordHidden, setPasswordHidden] = useState(true);

  return (
    <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14 mb-4 focus:border-brand-primary focus:bg-white transition-colors">
      <View className="w-8 items-center justify-center">
        <Ionicons name={icon} size={20} color="#6B7280" />
      </View>

      <TextInput
        placeholder={placeholder}
        secureTextEntry={secure ? passwordHidden : false}
        keyboardType={keyboardType}
        value={value}
        onChangeText={(text) =>
          keyboardType === "number-pad"
            ? onChangeText(text.replace(/[^0-9]/g, ""))
            : onChangeText(text)
        }
        maxLength={maxLength}
        className="ml-2 flex-1 text-base text-gray-800 font-medium h-full"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
      />

      {secure && (
        <Pressable
          onPress={() => setPasswordHidden(!passwordHidden)}
          hitSlop={12}
          className="ml-2"
        >
          <Ionicons
            name={passwordHidden ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#9CA3AF"
          />
        </Pressable>
      )}
    </View>
  );
}
