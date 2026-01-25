import { useAuth } from "@/context/AuthContext";
import { useMemberApplication } from "@/hooks/useMemberApplication";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewApplication() {
  const { user } = useAuth();
  const router = useRouter();

  const {
    data: application,
    isLoading,
    isError,
  } = useMemberApplication(user?.id);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    national_id: "",
    passport_number: "",
    marital_status: "",
    education_level: "",
    phone_number: "",
    email: "",
    physical_address: "",
    district: "",
    sub_county: "",
    parish: "",
    village: "",
    resident_type: "",
    occupation: "",
    employer_name: "",
    income_source: "",
    monthly_income: "",
    next_of_kin_name: "",
    next_of_kin_relationship: "",
    next_of_kin_phone: "",
    next_of_kin_address: "",
  });

  /* ---------------- HYDRATE FORM FROM CACHE ---------------- */
  useEffect(() => {
    if (!application) return;
    setForm((prev) => ({ ...prev, ...application }));
  }, [application]);

  /* ---------------- UPDATE HANDLER (MISSING LOGIC) ---------------- */
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- RESUBMIT ---------------- */
  const handleResubmit = async () => {
    setSubmitting(true);

    const { error } = await supabase
      .from("member_applications")
      .update({
        ...form,
        monthly_income: Number(form.monthly_income),
        status: "pending",
        rejection_reason: null,
        submitted_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setSubmitting(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert(
      "Application Resubmitted",
      "Your application has been sent for review again.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/(member)/(tabs)/dashboard"),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-slate-400 mt-4 font-medium">
          Loading application...
        </Text>
      </View>
    );
  }

  if (isError || !application) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 font-semibold">
          Failed to load application
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* HEADER */}
        <View className="px-6 pb-4 border-b border-slate-50 bg-white">
          <View className="flex-row items-center mb-2">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 mr-2 bg-slate-50 rounded-full"
            >
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </Pressable>
            <Text className="text-xl font-black text-slate-900">
              Review & Edit
            </Text>
          </View>
          <Text className="text-sm text-slate-500 font-medium">
            Please correct the highlighted information and resubmit.
          </Text>
        </View>

        <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* REJECTION REASON */}
          {application.status === "rejected" &&
            application.rejection_reason && (
              <View className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="alert-circle" size={20} color="#EF4444" />
                  <Text className="ml-2 font-bold text-red-600 uppercase tracking-widest text-xs">
                    Reason for Rejection
                  </Text>
                </View>
                <Text className="text-red-700 font-medium leading-6">
                  {application.rejection_reason}
                </Text>
              </View>
            )}

          {/* SECTION 1: PERSONAL IDENTITY */}
          <View className="mb-8">
            <SectionHeader
              title="Personal Identity"
              icon="person-circle-outline"
            />
            <View className="flex-row gap-x-3">
              <View className="flex-1">
                {renderInput(
                  "Title",
                  form.title,
                  (v) => updateField("title", v),
                  "default",
                  "text-outline",
                )}
              </View>
              <View className="flex-1">
                {renderInput(
                  "Gender",
                  form.gender,
                  (v) => updateField("gender", v),
                  "default",
                  "male-female-outline",
                )}
              </View>
            </View>
            {renderInput(
              "First Name",
              form.first_name,
              (v) => updateField("first_name", v),
              "default",
              "person-outline",
            )}
            {renderInput(
              "Last Name",
              form.last_name,
              (v) => updateField("last_name", v),
              "default",
              "person-outline",
            )}
            {renderInput(
              "Date of Birth (YYYY-MM-DD)",
              form.date_of_birth,
              (v) => updateField("date_of_birth", v),
              "default",
              "calendar-outline",
            )}
            {renderInput(
              "National ID (NIN)",
              form.national_id,
              (v) => updateField("national_id", v),
              "default",
              "card-outline",
            )}
            {renderInput(
              "Passport Number",
              form.passport_number,
              (v) => updateField("passport_number", v),
              "default",
              "globe-outline",
            )}
            {renderInput(
              "Marital Status",
              form.marital_status,
              (v) => updateField("marital_status", v),
              "default",
              "heart-half-outline",
            )}
            {renderInput(
              "Education Level",
              form.education_level,
              (v) => updateField("education_level", v),
              "default",
              "book-outline",
            )}
          </View>
          {/* SECTION 2: CONTACT & LOCATION */}
          <View className="mb-8">
            <SectionHeader title="Location & Contact" icon="location-outline" />

            {renderInput(
              "Phone Number",
              form.phone_number,
              (v) => updateField("phone_number", v),
              "phone-pad",
              "call-outline",
            )}
            {renderInput(
              "Email Address",
              form.email,
              (v) => updateField("email", v),
              "email-address",
              "mail-outline",
            )}

            <View className="h-[1px] bg-slate-100 my-4" />

            {renderInput(
              "Physical Address",
              form.physical_address,
              (v) => updateField("physical_address", v),
              "default",
              "home-outline",
            )}

            <View className="flex-row gap-x-3">
              <View className="flex-1">
                {renderInput(
                  "District",
                  form.district,
                  (v) => updateField("district", v),
                  "default",
                  "map-outline",
                )}
              </View>
              <View className="flex-1">
                {renderInput(
                  "Sub County",
                  form.sub_county,
                  (v) => updateField("sub_county", v),
                  "default",
                  "navigate-circle-outline",
                )}
              </View>
            </View>

            <View className="flex-row gap-x-3">
              <View className="flex-1">
                {renderInput(
                  "Parish",
                  form.parish,
                  (v) => updateField("parish", v),
                  "default",
                  "business-outline",
                )}
              </View>
              <View className="flex-1">
                {renderInput(
                  "Village",
                  form.village,
                  (v) => updateField("village", v),
                  "default",
                  "trail-sign-outline",
                )}
              </View>
            </View>

            {renderInput(
              "Resident Type",
              form.resident_type,
              (v) => updateField("resident_type", v),
              "default",
              "home-outline",
            )}
          </View>

          {/* SECTION 3: EMPLOYMENT */}
          <View className="mb-8">
            <SectionHeader
              title="Employment & Income"
              icon="briefcase-outline"
            />

            {renderInput(
              "Occupation",
              form.occupation,
              (v) => updateField("occupation", v),
              "default",
              "id-card-outline",
            )}
            {renderInput(
              "Employer Name",
              form.employer_name,
              (v) => updateField("employer_name", v),
              "default",
              "business-outline",
            )}

            {renderInput(
              "Source of Income",
              form.income_source,
              (v) => updateField("income_source", v),
              "default",
              "wallet-outline",
            )}
            {renderInput(
              "Monthly Income",
              form.monthly_income ? String(form.monthly_income) : "",
              (v) => updateField("monthly_income", v),
              "numeric",
              "cash-outline",
            )}
          </View>

          {/* SECTION 4: NEXT OF KIN */}
          <View className="mb-8">
            <SectionHeader
              title="Next of Kin Details"
              icon="people-circle-outline"
            />

            {renderInput(
              "Full Name",
              form.next_of_kin_name,
              (v) => updateField("next_of_kin_name", v),
              "default",
              "person-add-outline",
            )}
            {renderInput(
              "Relationship",
              form.next_of_kin_relationship,
              (v) => updateField("next_of_kin_relationship", v),
              "default",
              "heart-outline",
            )}
            {renderInput(
              "Contact Phone",
              form.next_of_kin_phone,
              (v) => updateField("next_of_kin_phone", v),
              "phone-pad",
              "call-outline",
            )}
            {renderInput(
              "Address",
              form.next_of_kin_address,
              (v) => updateField("next_of_kin_address", v),
              "default",
              "home-outline",
            )}
          </View>
          {/* SUBMIT */}
          <View className="pb-20">
            <Pressable
              onPress={handleResubmit}
              disabled={submitting}
              className={`py-4 rounded-2xl flex-row justify-center items-center ${
                submitting ? "bg-slate-300" : "bg-indigo-600"
              }`}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white font-bold text-lg mr-2">
                    Resubmit Application
                  </Text>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */
function SectionHeader({ title, icon }) {
  return (
    <View className="flex-row items-center mb-4 border-b border-slate-100 pb-2">
      <Ionicons name={icon} size={20} color="#4F46E5" />
      <Text className="text-sm font-bold text-indigo-900 uppercase tracking-widest ml-2">
        {title}
      </Text>
    </View>
  );
}

function renderInput(
  label,
  value,
  onChange,
  keyboardType = "default",
  icon = "pencil-outline",
) {
  return (
    <View className="mb-4">
      <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
        {label}
      </Text>
      <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 focus:border-indigo-500">
        <Ionicons name={icon} size={18} color="#94A3B8" />
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          placeholderTextColor="#CBD5E1"
          placeholder={label} // Added placeholder for better UX
          className="flex-1 ml-3 text-slate-900 font-semibold text-sm h-full"
        />
      </View>
    </View>
  );
}
