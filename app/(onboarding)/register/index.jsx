import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterIndex() {
  const router = useRouter();

  // Helper component for the visual checklist
  const StepItem = ({ icon, title, isLast = false }) => (
    <View className="flex-row mb-1">
      <View className="items-center mr-4">
        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center border border-slate-200">
          <Ionicons name={icon} size={20} color="#0F172A" />
        </View>
        {!isLast && <View className="w-[1.5px] h-8 bg-slate-200" />}
      </View>
      <View className="pt-2">
        <Text className="text-slate-700 font-medium text-[15px]">{title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-8 pt-8 w-full max-w-md h-full md:h-[90vh] md:max-h-[850px]"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="mb-10">
          <View className="bg-indigo-50 w-16 h-16 rounded-3xl items-center justify-center mb-6">
            <Ionicons name="business" size={32} color="#4F46E5" />
          </View>
          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
            SACCO Membership
          </Text>
          <Text className="text-lg text-slate-500 mt-2 font-medium">
            Join our community in just a few steps.
          </Text>
        </View>

        {/* Steps Visualizer */}
        <View className="mb-8">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Application Requirements
          </Text>

          <StepItem
            icon="person-outline"
            title="Personal Info (Name, NIN, DOB)"
          />
          <StepItem
            icon="location-outline"
            title="Contact & Location details"
          />
          <StepItem icon="briefcase-outline" title="Employment & Income" />
          <StepItem icon="people-outline" title="Next of Kin details" />
          <StepItem
            icon="checkmark-circle-outline"
            title="Final Review & Submit"
            isLast={true}
          />
        </View>

        {/* Trust & Transparency Card */}
        <View className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 flex-row items-start mb-10">
          <Ionicons name="information-circle" size={22} color="#64748B" />
          <Text className="text-slate-500 text-sm ml-3 leading-5 flex-1 font-medium">
            Your application will be reviewed by SACCO administrators. Access to
            savings, loans, and dividends will be granted immediately after
            approval.
          </Text>
        </View>
      </ScrollView>

      {/* Footer - Fixed at bottom */}
      <View className="px-8 pb-10 pt-4 bg-white border-t border-slate-50">
        <Pressable
          onPress={() => router.push("/(onboarding)/register/step-1")}
          className="bg-brand-primary h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-brand-primary/20"
        >
          <Text className="text-white text-center font-bold text-lg mr-2">
            Start Application
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>

        <Text className="text-center text-slate-400 text-xs mt-4 font-medium">
          Estimated time: 3 minutes
        </Text>
      </View>
    </SafeAreaView>
  );
}
