import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MEMBERS_DATA } from "../../../constants/data";

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
  const member = MEMBERS_DATA.find((m) => String(m.id) === String(id));

  if (!member) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Member not found</Text>
      </View>
    );
  }

  const loan = member.loan || {};

  const saveChanges = () => {
    Alert.alert("Saved", "Member data has been updated (MVP).");
    setIsEditing(false);
    // TODO: Implement Supabase API call to update member profile data
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
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
              {member.firstName?.charAt(0) ?? ""}
              {member.lastName?.charAt(0) ?? ""}
            </Text>
          </View>
          <View>
            <Text className="text-2xl font-black text-slate-900">
              {member.firstName} {member.lastName}
            </Text>
            <View className="bg-slate-200 px-3 py-1 rounded-md mt-2">
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                ID: {member.id}
              </Text>
            </View>
            {/* Status Badge */}
            <Pressable
              disabled={!isEditing}
              className={`mt-1 w-32 flex-row items-center px-4 py-1.5 rounded-full border ${
                member.status === "active"
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-red-50 border-red-100"
              }`}
            >
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  member.status === "active" ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <Text
                className={`text-xs font-bold uppercase ${
                  member.status === "active"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {member.status} {isEditing && "(Tap to Toggle)"}
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
            value={member.firstName}
            fieldName="firstName"
            icon="person-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="First Name"
            value={member.lastName}
            fieldName="lastName"
            icon="person-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Phone Number"
            value={member.phone}
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
                value={String(member.savings ?? "")}
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
                value={String(member.shares ?? "")}
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
          <View className="flex-row items-center justify-between bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
            <View className="flex-row items-center">
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text className="text-red-400 font-bold ml-2 text-xs">
                Outstanding Penalties
              </Text>
            </View>
            <TextInput
              value={String(member.penalties ?? "")}
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
            <View className="bg-blue-50 px-2 py-1 rounded text-xs">
              <Text className="text-blue-600 font-bold text-[10px]">
                {member.loan.status}
              </Text>
            </View>
          </View>
          <MemberField
            label="Outstanding Balance"
            value={loan.outstanding}
            fieldName="outstanding"
            icon="card-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Next Due Date"
            value={loan.nextDueDate}
            fieldName="nextDueDate"
            icon="calendar-outline"
            isEditing={isEditing}
          />
          <MemberField
            label="Interesting"
            value={loan.apr}
            fieldName="apr"
            icon="trending-up-outline"
            isEditing={isEditing}
          />
        </View>

        {/* 5. ADMIN NOTES & AUDIT */}
        <View className="mb-24">
          <Text className="text-slate-400 text-xs font-bold uppercase mb-4 ml-2 tracking-widest">
            System Logs
          </Text>

          {/* Notes Section */}
          <View className="bg-amber-50 p-5 rounded-2xl mb-4 border border-amber-100">
            <View className="flex-row items-center mb-3">
              <Ionicons name="document-text" size={16} color="#d97706" />
              <Text className="text-amber-800 font-bold ml-2 text-sm">
                Officer Notes
              </Text>
            </View>
            {member.notes.map((note, i) => (
              <View key={i} className="flex-row mb-2 items-start">
                <View className="w-1.5 h-1.5 bg-amber-300 rounded-full mt-1.5 mr-2" />
                <Text className="text-amber-900/80 text-xs leading-5 flex-1">
                  {note}
                </Text>
              </View>
            ))}
            <TextInput
              editable={isEditing}
              className={`border-b border-amber-200 py-2 mt-2 text-xs ${
                isEditing ? "text-amber-900" : "text-amber-400 italic"
              }`}
              placeholder={
                isEditing
                  ? "+ Add a quick note..."
                  : "Enable edit mode to add notes"
              }
              placeholderTextColor="#b45309"
            />
          </View>

          {/* Audit Timeline */}
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            {member.auditLog.map((log, i) => (
              <View key={i} className="flex-row mb-4 last:mb-0 relative">
                {/* Timeline Line */}
                {i !== member.auditLog.length - 1 && (
                  <View className="absolute left-[7px] top-4 bottom-[-16px] w-[1px] bg-slate-200" />
                )}

                <View className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 mt-0.5 mr-3 z-10" />

                <View>
                  <Text className="text-slate-800 font-bold text-xs">
                    {log.action}
                  </Text>
                  <Text className="text-slate-400 text-[10px] mt-0.5">
                    {log.date} • by {log.admin}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FLOATING SAVE ACTION */}
      {isEditing && (
        <View className="absolute bottom-8 left-6 right-6">
          <Pressable
            onPress={saveChanges}
            className="bg-[#07193f] py-4 rounded-2xl flex-row items-center justify-center shadow-xl shadow-blue-900/40"
          >
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
