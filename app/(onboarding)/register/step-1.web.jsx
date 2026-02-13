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

export default function Step1() {
  const router = useRouter();
  const { formData, updateForm } = useRegistration();
  const [errors, setErrors] = useState({
    first_name: null,
    last_name: null,
    date_of_birth: null,
    gender: null,
    national_id: null,
  });

  const isAdult = (dob) => {
    const ageDifMs = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
  };

  const validateStep = () => {
    const newErrors = {};

    // Allow spaces, hyphens, apostrophes (e.g., "Jean-Paul", "O'Neill")
    const nameRegex = /^[a-zA-Z\s'-]{2,}$/;

    if (!formData.first_name || !nameRegex.test(formData.first_name.trim())) {
      newErrors.first_name = "Enter a valid first name";
    }

    if (!formData.last_name || !nameRegex.test(formData.last_name.trim())) {
      newErrors.last_name = "Enter a valid last name";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    } else if (!isAdult(formData.date_of_birth)) {
      newErrors.date_of_birth = "You must be at least 18 years old";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    const cleanNIN = (formData.national_id || "").trim().toUpperCase();
    if (!/^(CM|CF|RF)[A-Z0-9]{12}$/.test(cleanNIN)) {
      newErrors.national_id = "Invalid NIN format (e.g. CM123...)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper for Input Fields
  const FormField = ({
    label,
    placeholder,
    value,
    onChange,
    icon,
    error,
    editable = true,
    onPress,
  }) => (
    <View className="mb-5">
      <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">
        {label}
      </Text>
      <Pressable onPress={onPress}>
        <View
          className={`flex-row items-center bg-slate-50 border rounded-2xl px-4 h-14 ${
            error
              ? "border-red-400 bg-red-50"
              : "border-slate-200 focus:border-arch-blue"
          }`}
        >
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#F87171" : "#94A3B8"}
          />
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            editable={editable}
            placeholderTextColor="#CBD5E1"
            className={`flex-1 ml-3 font-semibold text-base ${
              error ? "text-red-800" : "text-slate-900"
            }`}
            pointerEvents={editable ? "auto" : "none"}
          />
        </View>
      </Pressable>
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
              Step 1 of 5
            </Text>
          </View>

          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Personal Details
          </Text>
          <Text className="text-slate-500 font-medium mt-1">
            Let&quot;s start with your official identification.
          </Text>

          {/* Progress Bar Segment */}
          <View className="flex-row gap-1 mt-6">
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-slate-100 rounded-full" />
            <View className="h-1.5 flex-1 bg-slate-100 rounded-full" />
            <View className="h-1.5 flex-1 bg-slate-100 rounded-full" />
            <View className="h-1.5 flex-1 bg-slate-100 rounded-full" />
          </View>
        </View>

        {/* INPUTS */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
        >
          <View className="mt-2">
            <FormField
              label="First Name"
              placeholder="e.g. Frank"
              icon="person-outline"
              value={formData.first_name}
              onChange={(v) => {
                updateForm("first_name", v);
                if (errors.first_name)
                  setErrors({ ...errors, first_name: null });
              }}
              error={errors.first_name}
            />
            <FormField
              label="Last Name"
              placeholder="e.g. Mugume"
              icon="person-outline"
              value={formData.last_name}
              onChange={(v) => {
                updateForm("last_name", v);
                if (errors.last_name) setErrors({ ...errors, last_name: null });
              }}
              error={errors.last_name}
            />

            {/* Web-specific date input using HTML5 */}
            <View className="mb-5">
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">
                Date of Birth
              </Text>

              <View
                className={`flex-row items-center bg-slate-50 border rounded-2xl px-4 h-14 ${
                  errors.date_of_birth
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200"
                }`}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={errors.date_of_birth ? "#F87171" : "#94A3B8"}
                />

                <input
                  type="date"
                  value={formData.date_of_birth || ""}
                  onChange={(e) => {
                    updateForm("date_of_birth", e.target.value);
                    setErrors((prev) => ({ ...prev, date_of_birth: null }));
                  }}
                  max={new Date().toISOString().split("T")[0]}
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    color: formData.date_of_birth ? "#0F172A" : "#94A3B8",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    fontFamily: "inherit",
                  }}
                />
              </View>

              {errors.date_of_birth && (
                <Text className="text-red-500 text-[10px] ml-2 mt-1 font-medium">
                  {errors.date_of_birth}
                </Text>
              )}
            </View>

            <View className="mb-5">
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">
                Gender
              </Text>
              <View className="flex-row gap-4">
                {["Male", "Female"].map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      updateForm("gender", option);
                      setErrors({ ...errors, gender: null });
                    }}
                    className={`flex-1 flex-row items-center justify-center h-14 rounded-2xl border ${
                      formData.gender === option
                        ? "bg-indigo-50 border-arch-blue"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <Ionicons
                      name={option === "Male" ? "man" : "woman"}
                      size={18}
                      color={formData.gender === option ? "#0F172A" : "#94A3B8"}
                    />
                    <Text
                      className={`ml-2 font-bold ${
                        formData.gender === option
                          ? "text-arch-blue"
                          : "text-slate-500"
                      }`}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.gender && (
                <Text className="text-red-500 text-[10px] ml-2 mt-1 font-medium">
                  {errors.gender}
                </Text>
              )}
            </View>

            <FormField
              label="Marital Status"
              placeholder="e.g. Single"
              icon="heart-half-outline"
              value={formData.marital_status}
              onChange={(v) => {
                updateForm("marital_status", v);
                if (errors.marital_status)
                  setErrors({ ...errors, marital_status: null });
              }}
              error={errors.marital_status}
            />

            <FormField
              label="Education Level"
              placeholder="e.g. Campus"
              icon="book-outline"
              value={formData.education_level}
              onChange={(v) => {
                updateForm("education_level", v);
                if (errors.education_level)
                  setErrors({ ...errors, education_level: null });
              }}
              error={errors.education_level}
            />

            <FormField
              label="National ID (NIN)"
              placeholder="CM00000000XXXX"
              icon="card-outline"
              value={formData.national_id}
              onChange={(v) => {
                updateForm("national_id", v);
                if (errors.national_id)
                  setErrors({ ...errors, national_id: null });
              }}
              error={errors.national_id}
            />
            <FormField
              label="Passport Number(Optional)"
              placeholder="e.g. PC12367"
              icon="globe-outline"
              value={formData.passport_number}
              onChange={(v) => updateForm("passport_number", v)}
            />
          </View>
        </KeyboardAvoidingView>

        {/* SECURITY FOOTER */}
        <View className="flex-row items-center justify-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 mt-4 mb-10">
          <Ionicons name="lock-closed" size={14} color="#0F172A" />
          <Text className="text-[11px] text-arch-blue font-bold ml-2 uppercase tracking-tighter">
            End-to-end encrypted identification
          </Text>
        </View>
      </ScrollView>

      {/* FIXED BUTTON CONTAINER */}
      <View className="px-8 pb-2 pt-4 bg-white border-t border-slate-50">
        <Pressable
          onPress={() => {
            if (validateStep()) {
              router.push("/(onboarding)/register/step-2");
            } else {
              // Optional: Shake animation or toast could go here
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
