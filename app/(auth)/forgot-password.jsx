import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResetEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "archpesa://reset-password",
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Check your email", "We’ve sent you a password reset link.");
    }
  };

  return (
    <View className="flex-1 w-full">
      <Text className="text-2xl font-bold mb-2 text-white">Reset Password</Text>
      <Text className="text-gray-50 mb-6">
        Enter your email to receive a password reset link.
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        className="border rounded-lg border-arch-green px-6 py-3 mb-4 bg-white/5"
        value={email}
        onChangeText={setEmail}
      />

      <Pressable onPress={sendResetEmail} className="bg-white py-3 rounded-lg">
        <Text className="text-arch-blue text-center font-semibold">
          {loading ? "Sending..." : "Send Reset Link"}
        </Text>
      </Pressable>
    </View>
  );
}
