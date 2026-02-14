import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import { useMemberApplication } from "@/hooks/memberHooks/useMemberApplication";
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
  const { theme } = useTheme();

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
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <ActivityIndicator size="large" color={theme.indigo} />
        <Text className="mt-4 font-medium" style={{ color: theme.gray400 }}>
          Loading application...
        </Text>
      </View>
    );
  }

  if (isError || !application) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <Text style={{ color: theme.error }} className="font-semibold">
          Failed to load application
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 w-full"
      style={{ backgroundColor: theme.background }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* HEADER */}
        <View
          className="px-6 pb-4 border-b"
          style={{
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
          }}
        >
          <View className="flex-row items-center mb-2">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 mr-2 rounded-full"
              style={{ backgroundColor: theme.gray50 }}
            >
              <Ionicons name="arrow-back" size={20} color={theme.gray900} />
            </Pressable>

            <Text
              className="text-xl font-black"
              style={{ color: theme.gray900 }}
            >
              Review & Edit
            </Text>
          </View>
          <Text
            className="text-sm font-medium"
            style={{ color: theme.gray500 }}
          >
            Please correct the highlighted information and resubmit.
          </Text>
        </View>

        <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* REJECTION REASON */}
          {application.status === "rejected" &&
            application.rejection_reason && (
              <View
                className="mb-8 border rounded-2xl p-4"
                style={{
                  backgroundColor: theme.error + "0D",
                  borderColor: theme.error + "33",
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name="alert-circle" size={20} color={theme.error} />
                  <Text
                    className="ml-2 font-bold uppercase tracking-widest text-xs"
                    style={{ color: theme.error }}
                  >
                    Reason for Rejection
                  </Text>
                </View>
                <Text
                  className="font-medium leading-6"
                  style={{ color: theme.error }}
                >
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
                  theme,
                )}
              </View>
              <View className="flex-1">
                {renderInput(
                  "Gender",
                  form.gender,
                  (v) => updateField("gender", v),
                  "default",
                  "male-female-outline",
                  theme,
                )}
              </View>
            </View>
            {renderInput(
              "First Name",
              form.first_name,
              (v) => updateField("first_name", v),
              "default",
              "person-outline",
              theme,
            )}
            {renderInput(
              "Last Name",
              form.last_name,
              (v) => updateField("last_name", v),
              "default",
              "person-outline",
              theme,
            )}
            {renderInput(
              "Date of Birth (YYYY-MM-DD)",
              form.date_of_birth,
              (v) => updateField("date_of_birth", v),
              "default",
              "calendar-outline",
              theme,
            )}
            {renderInput(
              "National ID (NIN)",
              form.national_id,
              (v) => updateField("national_id", v),
              "default",
              "card-outline",
              theme,
            )}
            {renderInput(
              "Passport Number",
              form.passport_number,
              (v) => updateField("passport_number", v),
              "default",
              "globe-outline",
              theme,
            )}
            {renderInput(
              "Marital Status",
              form.marital_status,
              (v) => updateField("marital_status", v),
              "default",
              "heart-half-outline",
              theme,
            )}
            {renderInput(
              "Education Level",
              form.education_level,
              (v) => updateField("education_level", v),
              "default",
              "book-outline",
              theme,
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
              theme,
            )}
            {renderInput(
              "Email Address",
              form.email,
              (v) => updateField("email", v),
              "email-address",
              "mail-outline",
              theme,
            )}

            <View className="h-[1px] bg-slate-100 my-4" />

            {renderInput(
              "Physical Address",
              form.physical_address,
              (v) => updateField("physical_address", v),
              "default",
              "home-outline",
              theme,
            )}

            <View className="flex-row gap-x-3">
              <View className="flex-1">
                {renderInput(
                  "District",
                  form.district,
                  (v) => updateField("district", v),
                  "default",
                  "map-outline",
                  theme,
                )}
              </View>
              <View className="flex-1">
                {renderInput(
                  "Sub County",
                  form.sub_county,
                  (v) => updateField("sub_county", v),
                  "default",
                  "navigate-circle-outline",
                  theme,
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
                  theme,
                )}
              </View>
              <View className="flex-1">
                {renderInput(
                  "Village",
                  form.village,
                  (v) => updateField("village", v),
                  "default",
                  "trail-sign-outline",
                  theme,
                )}
              </View>
            </View>

            {renderInput(
              "Resident Type",
              form.resident_type,
              (v) => updateField("resident_type", v),
              "default",
              "home-outline",
              theme,
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
              theme,
            )}
            {renderInput(
              "Employer Name",
              form.employer_name,
              (v) => updateField("employer_name", v),
              "default",
              "business-outline",
              theme,
            )}

            {renderInput(
              "Source of Income",
              form.income_source,
              (v) => updateField("income_source", v),
              "default",
              "wallet-outline",
              theme,
            )}
            {renderInput(
              "Monthly Income",
              form.monthly_income ? String(form.monthly_income) : "",
              (v) => updateField("monthly_income", v),
              "numeric",
              "cash-outline",
              theme,
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
              theme,
            )}
            {renderInput(
              "Relationship",
              form.next_of_kin_relationship,
              (v) => updateField("next_of_kin_relationship", v),
              "default",
              "heart-outline",
              theme,
            )}
            {renderInput(
              "Contact Phone",
              form.next_of_kin_phone,
              (v) => updateField("next_of_kin_phone", v),
              "phone-pad",
              "call-outline",
              theme,
            )}
            {renderInput(
              "Address",
              form.next_of_kin_address,
              (v) => updateField("next_of_kin_address", v),
              "default",
              "home-outline",
              theme,
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
  const { theme } = useTheme();

  return (
    <View
      className="flex-row items-center mb-4 pb-2"
      style={{ borderBottomColor: theme.border, borderBottomWidth: 1 }}
    >
      <Ionicons name={icon} size={20} color={theme.indigo} />
      <Text
        className="text-sm font-bold uppercase tracking-widest ml-2"
        style={{ color: theme.indigo }}
      >
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
  theme,
) {
  return (
    <View className="mb-4">
      <Text
        className="text-[11px] font-bold uppercase tracking-widest mb-1.5 ml-1"
        style={{ color: theme.gray400 }}
      >
        {label}
      </Text>

      <View
        className="flex-row items-center rounded-2xl px-4 h-14"
        style={{
          backgroundColor: theme.gray50,
          borderColor: theme.border,
          borderWidth: 1,
        }}
      >
        <Ionicons name={icon} size={18} color={theme.gray400} />

        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          placeholder={label}
          placeholderTextColor={theme.gray300}
          className="flex-1 ml-3 font-semibold text-sm h-full"
          style={{ color: theme.gray900 }}
        />
      </View>
    </View>
  );
}
