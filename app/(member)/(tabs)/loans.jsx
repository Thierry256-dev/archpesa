import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoanActionCard from "../../../components/cards/LoanActionCard";
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";

export default function MemberLoans() {
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* BACKGROUND HEADER */}
      <View className="absolute top-0 w-full h-72 bg-arch-blue rounded-b-[40px]" />

      {/* HEADER */}
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
        <Pressable className="bg-white/10 p-2 rounded-xl">
          <Ionicons name="menu-outline" size={24} color="#FFF" />
        </Pressable>
        <Text className="text-white text-lg font-bold">Loan Center</Text>
        <Pressable className="bg-white/10 p-2 rounded-xl">
          <Ionicons name="help-circle-outline" size={24} color="#FFF" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 1. THE DEBT SUMMARY CARD */}
        <View className="bg-white mx-6 mt-6 rounded-3xl p-6 shadow-xl shadow-black/10">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase">
                Total Outstanding
              </Text>
              <Text className="text-3xl font-extrabold text-slate-900">
                UGX 2,400,000
              </Text>
            </View>
            <View className="bg-red-50 px-2 py-1 rounded-lg">
              <Text className="text-red-600 text-[10px] font-bold">
                14% APR
              </Text>
            </View>
          </View>

          {/* Progress Bar for current loan */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-xs font-medium">
                Repayment Progress
              </Text>
              <Text className="text-slate-900 text-xs font-bold">60% Paid</Text>
            </View>
            <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <View className="h-full w-[60%] bg-emerald-500 rounded-full" />
            </View>
          </View>

          <View className="flex-row justify-between border-t border-gray-50 pt-4">
            <View>
              <Text className="text-gray-400 text-[10px] uppercase">
                Next Installment
              </Text>
              <Text className="text-slate-800 font-bold">UGX 200,000</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-[10px] uppercase">
                Due Date
              </Text>
              <Text className="text-orange-600 font-bold">Feb 05, 2026</Text>
            </View>
          </View>
        </View>
        {/* 2. TAB TOGGLE */}
        <View className="flex-row mx-6 mt-8 bg-arch-blue/10 p-1 rounded-2xl border border-white/10">
          <TabButton
            label="Pending"
            identity="pending"
            active={activeTab}
            onPress={() => setActiveTab("pending")}
          />
          <TabButton
            label="Loan History"
            identity="history"
            onPress={() => setActiveTab("history")}
          />
        </View>
        {/* 3. GUARANTOR STATUS */}
        {/* PENDING LOAN HEADER CARD */}
        {activeTab === "pending" ? (
          <>
            <View className="px-6 mt-8 animate-in fade-in duration-500">
              <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-orange-600 font-bold text-[10px] uppercase">
                      Awaiting Approval
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-xs font-medium">
                    Applied: Jan 12, 2026
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                  Requested Amount
                </Text>
                <Text className="text-xl font-black text-slate-900">
                  UGX 2,500,000
                </Text>
                <View className="h-[1px] bg-gray-50 w-full my-2" />
                <Text className="text-gray-500 text-xs italic">
                  &quot;Business expansion for retail shop inventory.&quot;
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-4 px-1">
                <Text className="text-lg font-bold text-slate-900">
                  Official Approvals
                </Text>
                <View className="bg-blue-50 px-2 py-1 rounded-md">
                  <Text className="text-blue-600 font-bold text-[10px]">
                    Step 2 of 3
                  </Text>
                </View>
              </View>
              <View className="bg-white rounded-3xl p-4 shadow-sm border border-slate-50">
                <ApproverRow
                  name="President"
                  person="Dr. David K."
                  status="Pending"
                  icon="ribbon"
                />
                <ApproverRow
                  name="Treasurer"
                  person="Sarah Namuli"
                  status="Approved"
                  icon="wallet"
                />
                <ApproverRow
                  name="Credit Manager"
                  person="Musa Johnson"
                  status="Approved"
                  icon="shield-checkmark"
                  isLast
                />
              </View>
              <Text className="text-gray-400 text-[10px] mt-4 italic text-center px-6">
                *Approvals follow a hierarchy. Once the Credit Manager and
                Treasurer approve, the President gives final sign-off.
              </Text>
            </View>
          </>
        ) : (
          /* LOAN HISTORY TAB */
          <View className="px-6 mt-8">
            <Text className="text-lg font-bold text-slate-900 mb-4">
              Completed Loans
            </Text>
            <HistoryItem
              title="Emergency Loan"
              amount="UGX 500k"
              date="Dec 2025"
              status="Cleared"
            />
            <HistoryItem
              title="School Fees Loan"
              amount="UGX 1.2M"
              date="Aug 2025"
              status="Cleared"
            />
            <HistoryItem
              title="Boda Boda Loan"
              amount="UGX 3.5M"
              date="Jan 2024"
              status="Settled"
            />
          </View>
        )}
        {/* 4. LOAN OFFERS / QUICK ACTIONS */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-slate-900 mb-4">
            Need another loan?
          </Text>
          <View className="flex-row gap-x-4">
            <LoanActionCard
              title="Emergency"
              icon="flash"
              color="bg-amber-500"
              desc="Instant 24h loan"
            />
            <LoanActionCard
              title="Education"
              icon="school"
              color="bg-blue-600"
              desc="Low interest fees"
            />
          </View>
        </View>
        {/* FLOATING ACTION BUTTON */}
        <View className="w-full px-6 pt-2 pb-20">
          <Pressable
            onPress={() => setIsLoanFormVisible(true)}
            className="bg-slate-900 py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-slate-900/40"
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white font-extrabold text-lg ml-2">
              Apply for a Loan
            </Text>
          </Pressable>
        </View>
        <Modal visible={isLoanFormVisible} transparent animationType="slide">
          <LoanApplicationForm onClose={() => setIsLoanFormVisible(false)} />
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

function TabButton({ label, active, identity, onPress }) {
  let isActive = active === identity;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 py-3 rounded-xl ${isActive ? "bg-white shadow-md" : ""}`}
    >
      <Text
        className={`text-center font-bold ${
          isActive ? "text-arch-blue" : "text-slate-400"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ApproverRow({ name, person, status, icon, isLast }) {
  return (
    <View
      className={`flex-row justify-between items-center py-4 ${!isLast ? "border-b border-gray-50" : ""}`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-2xl items-center justify-center ${status === "Approved" ? "bg-emerald-50" : "bg-slate-50"}`}
        >
          <Ionicons
            name={icon}
            size={20}
            color={status === "Approved" ? "#10B981" : "#94A3B8"}
          />
        </View>
        <View className="ml-3">
          <Text className="text-gray-400 text-[10px] font-bold uppercase">
            {name}
          </Text>
          <Text className="font-bold text-slate-800 text-sm">{person}</Text>
        </View>
      </View>
      <View
        className={`px-3 py-1 rounded-full ${status === "Approved" ? "bg-emerald-100" : "bg-orange-50"}`}
      >
        <Text
          className={`text-[10px] font-black ${status === "Approved" ? "text-emerald-700" : "text-orange-600"}`}
        >
          {status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

function HistoryItem({ title, amount, date, status }) {
  return (
    <View className="bg-white mb-3 p-4 rounded-2xl flex-row justify-between items-center border border-gray-100">
      <View>
        <Text className="font-bold text-slate-800">{title}</Text>
        <Text className="text-gray-400 text-xs">{date}</Text>
      </View>
      <View className="items-end">
        <Text className="font-black text-slate-900">{amount}</Text>
        <View className="flex-row items-center">
          <Ionicons name="checkmark-done" size={14} color="#10B981" />
          <Text className="text-emerald-600 text-[10px] font-bold ml-1">
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
}
