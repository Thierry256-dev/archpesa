import useAdminAllInfo from "@/hooks/useAdminAllInfo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoFetchResult from "../../../components/ui/sharedUI/NoResult";
import { getNextDate } from "../../../utils/getNextDate";

const MemberField = ({ label, value, icon, isNumeric = false, isEditing }) => {
  return (
    <View className="mb-2">
      <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1 ml-1 tracking-wider">
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-2xl px-4 border ${
          isEditing
            ? "bg-white border-indigo-200 shadow-sm"
            : "bg-slate-50 border-transparent"
        }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isEditing ? "#07193f" : "#94a3b8"}
          style={{ marginRight: 10 }}
        />

        <TextInput
          value={value !== undefined && value !== null ? String(value) : ""}
          onChangeText={() => {}}
          keyboardType={isNumeric ? "numeric" : "default"}
          className="flex-1 font-semibold text-[#07193f] text-sm"
          editable={isEditing}
        />
      </View>
    </View>
  );
};

export default function MemberDetail() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useLocalSearchParams();

  const { members } = useAdminAllInfo();

  const member = members.find((m) => String(m.id) === String(id));

  if (!member) {
    return (
      <View className="flex-1 flex-col items-center justify-center">
        <NoFetchResult />
        <Text>Member not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] w-full">
      {/* TOP NAVIGATION */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-slate-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center border border-slate-100"
        >
          <Ionicons name="arrow-back" size={20} color="#0f172a" />
        </Pressable>
        <Text className="font-bold text-slate-800 text-lg">Member Profile</Text>
        <Pressable
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 9999,
            borderWidth: 1,
            backgroundColor: isEditing ? "#fffbeb" : "#07193f",
            borderColor: isEditing ? "#fde68a" : "#07193f",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: isEditing ? "#b45309" : "#ffffff",
            }}
          >
            {isEditing ? "Cancel" : "Umoja"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. IDENTITY CARD */}
        <View className="items-center mb-4 flex-row gap-8">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center border-4 border-white shadow-sm shadow-blue-100">
            <Text className="text-3xl font-black text-blue-600">
              {member.first_name?.charAt(0) ?? ""}
              {member.last_name?.charAt(0) ?? ""}
            </Text>
          </View>
          <View>
            <Text className="text-2xl font-black text-slate-900">
              {member.first_name} {member.last_name}
            </Text>
            <View className="bg-slate-200 px-3 py-1 rounded-md mt-2">
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                ID: {member.membership_no}
              </Text>
            </View>
            {/* Status Badge */}
            <Pressable
              disabled={!isEditing}
              className={`mt-1 w-32 flex-row items-center px-4 py-1.5 rounded-full border ${
                member.member_status === "Active"
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-red-50 border-red-100"
              }`}
            >
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  member.member_status === "Active"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />
              <Text
                className={`text-xs font-bold uppercase ${
                  member.member_status === "Active"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {member.member_status} {isEditing && "(Tap to Toggle)"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 2. PERSONAL DETAILS */}
        <View className="bg-white p-6 rounded-[24px] shadow-sm shadow-slate-200/50 mb-6 border border-slate-100">
          <Text className="text-slate-900 font-bold text-base mb-4 flex-row items-center">
            Member Details
          </Text>
          <MemberField
            label="First Name"
            value={member.first_name}
            fieldName="firstName"
            icon="person-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="First Name"
            value={member.last_name}
            fieldName="lastName"
            icon="person-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Phone Number"
            value={member.phone_number}
            fieldName="phone"
            icon="call-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Email Address"
            value={member.email}
            fieldName="email"
            icon="mail-outline"
            isEditing={isEditing}
          />
        </View>

        {/* 3. FINANCIAL OVERVIEW */}
        <View className="bg-arch-blue p-6 rounded-[24px] shadow-lg shadow-slate-900/20 mb-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white font-bold text-base">
              Financial Overview
            </Text>
            <Ionicons name="wallet" size={20} color="#64748b" />
          </View>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1 bg-white/10 p-4 rounded-2xl border border-white/5">
              <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                Savings
              </Text>
              <TextInput
                value={String(member.accounts[0].balance)}
                editable={isEditing}
                keyboardType="numeric"
                className={`text-white font-bold text-lg border-b pb-1 ${
                  isEditing ? "border-white/30" : "border-transparent"
                }`}
                selectTextOnFocus={isEditing}
              />
            </View>
            <View className="flex-1 bg-white/10 p-4 rounded-2xl border border-white/5">
              <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                Shares
              </Text>
              <TextInput
                value={String(member.accounts[0].balance / 10000)}
                editable={isEditing}
                keyboardType="numeric"
                className={`text-emerald-400 font-black text-xl border-b ${
                  isEditing ? "border-emerald-300" : "border-transparent"
                }`}
                selectTextOnFocus={isEditing}
              />
            </View>
          </View>

          {/* Penalties Row */}
          <View className="flex-row items-center justify-between  bg-white/10 p-4 rounded-2xl">
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                Fixed Deposit
              </Text>
            </View>
            <TextInput
              value={String(member.accounts[2].balance)}
              editable={isEditing}
              keyboardType="numeric"
              className={`text-white font-bold text-sm w-20 text-right border-b ${
                isEditing ? "border-white/30" : "border-transparent"
              }`}
              selectTextOnFocus={isEditing}
            />
          </View>
        </View>

        {/* 4. LOAN STATUS */}
        <View className="bg-white p-6 rounded-[24px] shadow-sm shadow-slate-200/50 mb-6 border border-slate-100">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-slate-900 font-bold text-base">
              Active Loan
            </Text>
          </View>
          <MemberField
            label="Tatal Amount"
            value={member.loan ? member.loan.total_payable : "N/A"}
            fieldName="outstanding"
            icon="card-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Outstanding Balance"
            value={member.loan ? member.loan.outstanding_balance : "N/A"}
            fieldName="outstanding"
            icon="card-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Next Due Date"
            value={member.loan ? getNextDate(member.loan.disbursed_at) : "N/A"}
            fieldName="nextDueDate"
            icon="calendar-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Interest Rate"
            value={member.loan ? member.loan.interest_rate * 100 : "N/A"}
            fieldName="apr"
            icon="trending-up-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Loan Purpose"
            value={member.loan ? member.loan.purpose : "N/A"}
            fieldName="apr"
            icon="rocket-outline"
            isEditing={isEditing}
          />
        </View>
      </ScrollView>

      {/* FLOATING SAVE ACTION */}
      {isEditing && (
        <View className="absolute bottom-8 left-6 right-6">
          <Pressable className="bg-[#07193f] py-4 rounded-2xl flex-row items-center justify-center shadow-xl shadow-blue-900/40">
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Save Changes
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
