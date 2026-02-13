import { useAuth } from "@/context/AuthContext";
import { useRegistration } from "@/context/RegistrationContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Step5() {
  const router = useRouter();
  const { user } = useAuth();
  const { formData, resetForm } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Helper for Section Headers
  const SectionHeader = ({ title, icon, onEditStep }) => (
    <View className="flex-row justify-between items-center mt-6 mb-3">
      <View className="flex-row items-center">
        <Ionicons name={icon} size={16} color="#4F46E5" />
        <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-2">
          {title}
        </Text>
      </View>
      <Pressable onPress={() => router.push(onEditStep)}>
        <Text className="text-indigo-600 text-xs font-bold">Edit</Text>
      </Pressable>
    </View>
  );

  // Helper for Data Rows
  const DataRow = ({ label, value }) => (
    <View className="flex-row justify-between py-1 border-b border-slate-50">
      <Text className="text-slate-500 text-sm font-medium">{label}</Text>
      <Text className="text-slate-900 text-sm font-bold">{value || "—"}</Text>
    </View>
  );

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be logged in to submit an application.");
      return;
    }
    try {
      setIsSubmitting(true);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        alert("Session expired. Please log in again.");
        return;
      }

      const { data: existing } = await supabase
        .from("member_applications")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (existing) {
        alert("You already submitted an application.");
        return;
      }

      if (!formData.date_of_birth) {
        alert("Date of birth is required.");
        return;
      }

      const { error } = await supabase.from("member_applications").insert({
        auth_user_id: user.id,
        ...formData,
        monthly_income: formData.monthly_income
          ? Number(formData.monthly_income)
          : null,
        status: "pending",
      });

      if (error) {
        console.error("SUPABASE ERROR:", error);
        alert(error.message);
        throw error;
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error("Application submission failed:", err);
      alert(
        "Something went wrong while submitting your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    resetForm();
    router.replace("/(member)/dashboard");
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-8 pt-10 w-full max-w-md h-full md:h-[90vh] md:max-h-[850px]"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Pressable onPress={() => router.back()} className="p-2 -ml-2">
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </Pressable>
            <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Final Step
            </Text>
          </View>

          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Review Details
          </Text>
          <Text className="text-slate-500 font-medium mt-1">
            Ensure all information is correct before submitting to the SACCO.
          </Text>
        </View>

        {/* DATA GROUPS */}
        <View className="mb-10">
          <SectionHeader
            title="Personal Identity"
            icon="person"
            onEditStep="/(onboarding)/register/step-1"
          />
          <View className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <DataRow
              label="Full Name"
              value={`${formData.title} ${formData.first_name} ${formData.last_name}`}
            />
            <DataRow label="Date of Birth" value={formData.date_of_birth} />
            <DataRow label="Gender" value={formData.gender} />
            <DataRow label="Marital Status" value={formData.marital_status} />
            <DataRow label="Education Level" value={formData.education_level} />
            <DataRow label="National ID (NIN)" value={formData.national_id} />
            {formData.passport_number !== "" && (
              <DataRow label="Gender" value={formData.gender} />
            )}
          </View>

          <SectionHeader
            title="Contact & Location"
            icon="location"
            onEditStep="/(onboarding)/register/step-2"
          />
          <View className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <DataRow label="Phone" value={formData.phone_number} />
            <DataRow label="Email" value={formData.email} />
            <DataRow
              label="Physical Address"
              value={formData.physical_address}
            />
            <DataRow label="District" value={formData.district} />
            <DataRow label="Sub-County" value={formData.sub_county} />
            <DataRow label="Parish" value={formData.parish} />
            <DataRow label="Village" value={formData.village} />
            <DataRow label="Resident Type" value={formData.resident_type} />
          </View>

          <SectionHeader
            title="Employment"
            icon="briefcase"
            onEditStep="/(onboarding)/register/step-3"
          />
          <View className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <DataRow label="Occupation" value={formData.occupation} />
            <DataRow label="Employer Name" value={formData.employer_name} />
            <DataRow label="Income Source" value={formData.income_source} />
            <DataRow
              label="Monthly Income"
              value={`UGX ${formData.monthly_income}`}
            />
          </View>

          <SectionHeader
            title="Beneficiary"
            icon="people"
            onEditStep="/(onboarding)/register/step-4"
          />
          <View className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <DataRow label="Next of Kin" value={formData.next_of_kin_name} />
            <DataRow
              label="Relationship"
              value={formData.next_of_kin_relationship}
            />
            <DataRow label="Phone" value={formData.next_of_kin_phone} />
            <DataRow label="Address" value={formData.next_of_kin_address} />
          </View>
        </View>

        {/* FINAL CONSENT NOTICE */}
        <View className="bg-indigo-600 p-6 rounded-[28px] mb-12 shadow-lg shadow-indigo-200">
          <Text className="text-white font-bold text-base mb-2">
            Final Declaration
          </Text>
          <Text className="text-indigo-100 text-xs leading-5">
            I hereby certify that the information provided is true and correct
            to the best of my knowledge. I understand that any false statement
            may lead to disqualification.
          </Text>
        </View>
      </ScrollView>

      {/* FIXED SUBMIT BUTTON */}
      <View className="px-8 pb-10 pt-4 bg-white border-t border-slate-50">
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`h-16 rounded-2xl flex-row items-center justify-center shadow-xl ${
            isSubmitting
              ? "bg-slate-300"
              : "bg-brand-primary shadow-brand-primary/20"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-white font-bold text-lg mr-2">
                Submit Application
              </Text>
              <Ionicons name="cloud-upload-outline" size={20} color="white" />
            </>
          )}
        </Pressable>
      </View>

      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white w-full rounded-[40px] p-8 items-center shadow-2xl">
            {/* Animated Icon Container */}
            <View className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-6">
              <View className="w-16 h-16 bg-emerald-500 rounded-full items-center justify-center shadow-lg shadow-emerald-200">
                <Ionicons name="checkmark" size={40} color="white" />
              </View>
            </View>

            <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
              Application Received!
            </Text>

            <Text className="text-slate-500 text-center leading-6 mb-8 px-2 font-medium">
              Your membership application has been successfully submitted to the
              SACCO board for review. We will notify you via SMS once approved.
            </Text>

            <Pressable
              onPress={handleGoToDashboard}
              className="bg-indigo-600 w-full h-14 rounded-2xl items-center justify-center shadow-lg shadow-indigo-200"
            >
              <Text className="text-white font-bold text-lg">
                Continue to Dashboard
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
