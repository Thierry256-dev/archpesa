import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = async () => {
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Password updated successfully");
      router.replace("/(auth)/login");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6">Set New Password</Text>

      <TextInput
        placeholder="New password"
        secureTextEntry
        className="border rounded-lg px-4 py-3 mb-3"
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        className="border rounded-lg px-4 py-3 mb-6"
        value={confirm}
        onChangeText={setConfirm}
      />

      <Pressable
        onPress={updatePassword}
        className="bg-brand-primary py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Updating..." : "Update Password"}
        </Text>
      </Pressable>
    </View>
  );
}
