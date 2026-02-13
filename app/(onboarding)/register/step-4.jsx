import { useRegistration } from "@/context/RegistrationContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Step4() {
  const router = useRouter();
  const { formData, updateForm } = useRegistration();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.next_of_kin_name?.trim()) {
      newErrors.next_of_kin_name = "Full name is required";
    } else if (formData.next_of_kin_name.trim().split(" ").length < 2) {
      newErrors.next_of_kin_name = "Enter at least two names";
    }

    if (!formData.next_of_kin_relationship?.trim()) {
      newErrors.next_of_kin_relationship = "Relationship is required";
    }

    if (!formData.next_of_kin_phone?.trim()) {
      newErrors.next_of_kin_phone = "Phone number is required";
    } else if (!/^(07\d{8}|2567\d{8})$/.test(formData.next_of_kin_phone)) {
      newErrors.next_of_kin_phone = "Enter a valid Ugandan phone number";
    }

    if (!formData.next_of_kin_address?.trim()) {
      newErrors.next_of_kin_address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    router.push("/(onboarding)/register/step-5");
  };

  const FormField = ({ label, placeholder, value, onChange, icon, error }) => (
    <View className="mb-5">
      <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </Text>

      <View
        className={`flex-row items-center bg-slate-50 border rounded-2xl px-4 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      >
        <Ionicons name={icon} size={20} color={error ? "#DC2626" : "#94A3B8"} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          placeholderTextColor="#CBD5E1"
          className="flex-1 ml-3 text-slate-900 font-semibold text-base"
        />
      </View>

      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-8 w-full max-w-md h-full md:h-[90vh] md:max-h-[850px]"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER & PROGRESS */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Pressable onPress={() => router.back()} className="p-2 -ml-2">
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </Pressable>
            <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Step 4 of 5
            </Text>
          </View>

          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Next of Kin
          </Text>
          <Text className="text-slate-500 font-medium mt-1">
            Who should be contacted in case of emergencies?
          </Text>

          {/* Progress Bar Segment */}
          <View className="flex-row gap-1 mt-6">
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-slate-100 rounded-full" />
          </View>
        </View>

        {/* INPUTS */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          className="mt-2"
        >
          <FormField
            label="Full Name"
            placeholder="e.g. James Sempijja"
            icon="people-outline"
            value={formData.next_of_kin_name}
            onChange={(v) => updateForm("next_of_kin_name", v)}
            error={errors.next_of_kin_name}
          />

          <FormField
            label="Relationship"
            placeholder="e.g. Spouse, Parent"
            icon="git-network-outline"
            value={formData.next_of_kin_relationship}
            onChange={(v) => updateForm("next_of_kin_relationship", v)}
            error={errors.next_of_kin_relationship}
          />

          <FormField
            label="Phone"
            placeholder="e.g. 0701234567"
            icon="call-outline"
            value={formData.next_of_kin_phone}
            onChange={(v) => updateForm("next_of_kin_phone", v)}
            error={errors.next_of_kin_phone}
          />

          <FormField
            label="Address"
            placeholder="e.g. Wakiso, Kampala"
            icon="location-outline"
            value={formData.next_of_kin_address}
            onChange={(v) => updateForm("next_of_kin_address", v)}
            error={errors.next_of_kin_address}
          />
        </KeyboardAvoidingView>

        {/* GUIDANCE CARD */}
        <View className="bg-slate-50 p-5 rounded-[24px] border border-slate-200/60 flex-row items-start mt-4 mb-10">
          <View className="bg-white p-2 rounded-xl shadow-sm">
            <Ionicons name="shield-outline" size={20} color="#4F46E5" />
          </View>
          <Text className="text-slate-500 text-sm ml-4 leading-5 flex-1 font-medium">
            A Next of Kin is essential for SACCO compliance. They act as your
            primary beneficiary and emergency contact.
          </Text>
        </View>
      </ScrollView>

      {/* FIXED BUTTON CONTAINER */}
      <View className="px-8 pb-10 pt-4 bg-white border-t border-slate-50">
        <Pressable
          onPress={handleContinue}
          className="bg-arch-blue h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-indigo-200"
        >
          <Text className="text-white font-bold text-lg mr-2">
            Review Application
          </Text>
          <Ionicons name="eye-outline" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
