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

export default function Step2() {
  const router = useRouter();
  const { formData, updateForm } = useRegistration();
  const [errors, setErrors] = useState({
    phone_number: null,
    email: null,
    district: null,
    sub_county: null,
    parish: null,
    village: null,
  });

  const validateStep = () => {
    const newErrors = {};

    // Normalize phone
    const rawPhone = (formData.phone_number || "").replace(/\s+/g, "");
    const phoneRegex = /^(07\d{8}|2567\d{8}|\+2567\d{8})$/;

    if (!rawPhone) {
      newErrors.phone_number = "Phone number is required";
    } else if (!phoneRegex.test(rawPhone)) {
      newErrors.phone_number = "Enter a valid phone number";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    // Location fields (optional but clean)
    const locationRegex = /^[a-zA-Z\s'-]{2,}$/;

    ["district", "sub_county", "parish", "village"].forEach((field) => {
      const value = formData[field];
      if (value && !locationRegex.test(value.trim())) {
        newErrors[field] = "Only letters allowed";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const FormField = ({
    label,
    placeholder,
    value,
    onChange,
    icon,
    keyboardType = "default",
    error,
  }) => (
    <View className="mb-4">
      <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </Text>

      <View
        className={`flex-row items-center bg-slate-50 border rounded-2xl px-4 ${
          error ? "border-red-400 bg-red-50" : "border-slate-200"
        }`}
      >
        <Ionicons name={icon} size={20} color={error ? "#F87171" : "#94A3B8"} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          placeholderTextColor="#CBD5E1"
          className={`flex-1 ml-3 font-semibold text-base ${
            error ? "text-red-800" : "text-slate-900"
          }`}
        />
      </View>

      {error && (
        <Text className="text-red-500 text-[10px] ml-2 mt-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
        {/* HEADER & PROGRESS */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Pressable onPress={() => router.back()} className="p-2 -ml-2">
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </Pressable>
            <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Step 2 of 5
            </Text>
          </View>

          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Details
          </Text>
          <Text className="text-slate-500 font-medium mt-1">
            How can the SACCO reach you?
          </Text>

          {/* Progress Bar Segment */}
          <View className="flex-row gap-1 mt-6">
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-slate-100 rounded-full" />
            <View className="h-1.5 flex-1 bg-slate-100 rounded-full" />
            <View className="h-1.5 flex-1 bg-slate-100 rounded-full" />
          </View>
        </View>

        {/* INPUTS */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          className="mt-2"
        >
          <FormField
            label="Phone Number"
            placeholder="07XX XXX XXX"
            icon="call-outline"
            keyboardType="phone-pad"
            value={formData.phone_number}
            onChange={(v) => {
              updateForm("phone_number", v);
              if (errors.phone_number)
                setErrors({ ...errors, phone_number: null });
            }}
            error={errors.phone_number}
          />

          <FormField
            label="Email Address"
            placeholder="your@email.com"
            icon="mail-outline"
            keyboardType="email-address"
            value={formData.email}
            onChange={(v) => {
              updateForm("email", v.toLowerCase());
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            error={errors.email}
          />

          <FormField
            label="Physical Address"
            placeholder="e.g. Jussy Hostel"
            icon="location-outline"
            value={formData.physical_address}
            onChange={(v) => updateForm("physical_address", v)}
          />

          <FormField
            label="District"
            placeholder="e.g. Wakiso"
            icon="location-outline"
            value={formData.district}
            onChange={(v) => updateForm("district", v)}
          />

          <FormField
            label="Sub-County"
            placeholder="e.g. Nangabo"
            icon="location-outline"
            value={formData.sub_county}
            onChange={(v) => updateForm("sub_county", v)}
          />

          <FormField
            label="Parish"
            placeholder="e.g. Matugga"
            icon="location-outline"
            value={formData.parish}
            onChange={(v) => updateForm("parish", v)}
          />

          <FormField
            label="village"
            placeholder="e.g. Kito"
            icon="location-outline"
            value={formData.village}
            onChange={(v) => updateForm("village", v)}
          />
          <FormField
            label="Resident Type"
            placeholder="e.g. Permanent"
            icon="home-outline"
            value={formData.resident_type}
            onChange={(v) => updateForm("resident_type", v)}
          />
        </KeyboardAvoidingView>

        {/* HELPER TEXT */}
        <Text className="text-center text-slate-400 text-[11px] font-medium px-4 mt-2 mb-10">
          Ensure your phone number is active as it will be used for SMS
          notifications and balance alerts.
        </Text>
      </ScrollView>

      {/* FIXED BUTTON CONTAINER */}
      <View className="px-8 pb-10 pt-4 bg-white border-t border-slate-50">
        <Pressable
          onPress={() => {
            if (validateStep()) {
              router.push("/(onboarding)/register/step-3");
            }
          }}
          className="bg-arch-blue h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-indigo-200"
        >
          <Text className="text-white font-bold text-lg mr-2">Continue</Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
