import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Register() {
  const router = useRouter();

  // Form state
  const [saccoQuery, setSaccoQuery] = useState("");
  const [selectedSacco, setSelectedSacco] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [memberId, setMemberId] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  // Dummy SACCO results
  const saccoResults = [
    "Umoja SACCO",
    "Arch Savings Group",
    "GreenGrow SACCO",
  ].filter((s) => s.toLowerCase().includes(saccoQuery.toLowerCase()));

  const handleSubmit = () => {
    setError("");

    if (!selectedSacco) {
      return setError("Please select a SACCO to join.");
    }
    if (!fullName.trim()) {
      return setError("Full name is required.");
    }
    if (phone.length < 10) {
      return setError("Phone number must be at least 10 digits.");
    }
    if (pin.length < 6) {
      return setError("PIN must be 6 digits.");
    }
    if (pin !== confirmPin) {
      return setError("PINs do not match.");
    }

    // Passed validation
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      className="flex-1 bg-arch-blue px-6"
      contentContainerStyle={{ paddingVertical: 40 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
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

      {/* Form Card */}
      <View className="bg-brand-surface rounded-2xl p-5">
        {/* SACCO Search */}
        <Text className="text-sm font-semibold text-arch-slate mb-2">
          Select SACCO
        </Text>

        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-1 mb-3">
          <Ionicons name="search-outline" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search SACCO name"
            value={saccoQuery}
            onChangeText={setSaccoQuery}
            className="ml-3 flex-1 text-arch-charcoal"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {saccoQuery.length > 0 && (
          <View className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
            {saccoResults.map((sacco, index) => (
              <Pressable
                key={index}
                className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                onPress={() => {
                  setSelectedSacco(sacco);
                  setSaccoQuery(sacco);
                }}
              >
                <Text className="text-arch-charcoal">{sacco}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Member Details */}
        <Text className="text-sm font-semibold text-arch-slate mb-2">
          Member Details
        </Text>

        <Input
          icon="person-outline"
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <Input
          icon="call-outline"
          placeholder="Phone Number"
          keyboardType="number-pad"
          value={phone}
          maxLength={15}
          onChangeText={setPhone}
        />
        <Input
          icon="card-outline"
          placeholder="National ID / Member ID"
          value={memberId}
          onChangeText={setMemberId}
        />

        {/* Security */}
        <Text className="text-sm font-semibold text-arch-slate mt-4 mb-2">
          Security
        </Text>

        <Input
          icon="lock-closed-outline"
          placeholder="Create PIN"
          secure
          keyboardType="number-pad"
          maxLength={6}
          value={pin}
          onChangeText={setPin}
        />
        <Input
          icon="lock-closed-outline"
          placeholder="Confirm PIN"
          secure
          keyboardType="number-pad"
          maxLength={6}
          value={confirmPin}
          onChangeText={setConfirmPin}
        />

        {/* Error */}
        {error ? (
          <Text className="text-red-500 text-sm mt-2">{error}</Text>
        ) : null}

        {/* Submit */}
        <Pressable
          className="bg-arch-green py-4 rounded-xl mt-6"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">
            Register & Join SACCO
          </Text>
        </Pressable>

        <Pressable
          className="mt-3"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-center text-brand-primary font-semibold">
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View className="items-center mt-6">
        <Text className="text-xs text-gray-300">
          Your data is secured by ArchPesa
        </Text>
      </View>
    </ScrollView>
  );
}

/* Reusable Input */
function Input({
  icon,
  placeholder,
  secure,
  keyboardType,
  value,
  onChangeText,
  maxLength,
}) {
  return (
    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-1 mb-3">
      <Ionicons name={icon} size={18} color="#6B7280" />
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        value={value}
        onChangeText={(text) =>
          keyboardType === "number-pad"
            ? onChangeText(text.replace(/[^0-9]/g, ""))
            : onChangeText(text)
        }
        maxLength={maxLength}
        className="ml-3 flex-1 text-arch-charcoal"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}
