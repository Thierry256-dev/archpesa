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

export default function Step3() {
  const router = useRouter();
  const { formData, updateForm } = useRegistration();
  const [errors, setErrors] = useState({
    occupation: null,
    employer_name: null,
    income_source: null,
    monthly_income: null,
  });

  const validateStep = () => {
    const newErrors = {};

    const textRegex = /^[a-zA-Z\s'/\-]{2,}$/;

    if (formData.occupation && !textRegex.test(formData.occupation.trim())) {
      newErrors.occupation = "Invalid occupation";
    }

    if (
      formData.employer_name &&
      !textRegex.test(formData.employer_name.trim())
    ) {
      newErrors.employer_name = "Invalid employer name";
    }

    if (
      formData.income_source &&
      !textRegex.test(formData.income_source.trim())
    ) {
      newErrors.income_source = "Invalid income source";
    }

    // Monthly income (required)
    const income = Number(formData.monthly_income);

    if (!formData.monthly_income) {
      newErrors.monthly_income = "Monthly income is required";
    } else if (isNaN(income) || income <= 0) {
      newErrors.monthly_income = "Enter a valid amount";
    } else if (income < 50000) {
      newErrors.monthly_income = "Income seems too low";
    }

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
    prefix,
    error,
  }) => (
    <View className="mb-5">
      <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </Text>

      <View
        className={`flex-row items-center rounded-2xl px-4 h-16 border ${
          error ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"
        }`}
      >
        <Ionicons name={icon} size={20} color={error ? "#F87171" : "#94A3B8"} />

        {prefix && (
          <Text className="ml-2 text-slate-400 font-bold text-base">
            {prefix}
          </Text>
        )}

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
              Step 3 of 5
            </Text>
          </View>

          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Work & Income
          </Text>
          <Text className="text-slate-500 font-medium mt-1">
            This helps us tailor loan limits for you.
          </Text>

          {/* Progress Bar Segment */}
          <View className="flex-row gap-1 mt-6">
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
            <View className="h-1.5 flex-1 bg-arch-green rounded-full" />
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
            label="Occupation"
            placeholder="e.g. Civil Servant / Business"
            icon="briefcase-outline"
            value={formData.occupation}
            onChange={(v) => {
              updateForm("occupation", v);
              if (errors.occupation) setErrors({ ...errors, occupation: null });
            }}
            error={errors.occupation}
          />

          <FormField
            label="Employer Name"
            placeholder="e.g. Mr. Kabogoza Anthony"
            icon="person-outline"
            value={formData.employer_name}
            onChange={(v) => {
              updateForm("employer_name", v);
              if (errors.employer_name)
                setErrors({ ...errors, employer_name: null });
            }}
            error={errors.employer_name}
          />

          <FormField
            label="Income Source"
            placeholder="e.g. Forex Trading"
            icon="briefcase-outline"
            value={formData.income_source}
            onChange={(v) => {
              updateForm("income_source", v);
              if (errors.income_source)
                setErrors({ ...errors, income_source: null });
            }}
            error={errors.income_source}
          />

          <FormField
            label="Monthly Income"
            placeholder="0.00"
            icon="cash-outline"
            prefix="UGX"
            keyboardType="numeric"
            value={formData.monthly_income}
            onChange={(v) => {
              updateForm("monthly_income", v.replace(/[^0-9.]/g, ""));
              if (errors.monthly_income)
                setErrors({ ...errors, monthly_income: null });
            }}
            error={errors.monthly_income}
          />
        </KeyboardAvoidingView>

        {/* TRUST INDICATOR */}
        <View className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex-row items-center mt-4">
          <Ionicons name="shield-checkmark" size={18} color="#059669" />
          <Text className="text-emerald-700 text-xs ml-3 leading-4 font-medium flex-1">
            Your financial data is private and encrypted. It is only used for
            credit assessment.
          </Text>
        </View>
      </ScrollView>

      {/* FIXED BUTTON CONTAINER */}
      <View className="px-8 pb-10 pt-4 bg-white border-t border-slate-50">
        <Pressable
          onPress={() => {
            if (validateStep()) {
              router.push("/(onboarding)/register/step-4");
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
