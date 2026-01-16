import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "../../../components/cards/ServiceCard";
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";
import TransactionItem from "../../../components/ui/TransactionItem";

export default function MemberDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);
  const router = useRouter();

  // Mock Data for "Real World" simulation
  const loanLimit = 5000000;
  const currentLoan = 1200000;
  const progress = (currentLoan / loanLimit) * 100;

  return (
    <View className="flex-1 bg-gray-50">
      {/* 1. HEADER BACKGROUND SECTION */}
      <View className="relative w-full h-80 rounded-b-[20px] overflow-hidden z-0">
        <Image
          source={require("../../../assets/images/welcome.png")} // Ensure path matches your folder
          className="w-full h-full object-cover"
        />
        <View className="absolute inset-0 bg-black/40" />
        <View className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent" />
      </View>

      {/* 2. FOREGROUND CONTENT (Profile & Greeting) */}
      <SafeAreaView className="absolute top-0 w-full">
        <View className="px-6 pt-4">
          {/* Top Row: Profile & Notifications */}
          <View className="flex-row items-center justify-between mb-8">
            <Pressable
              onPress={() => router.push("/(member)/utilityPages/profile")}
              className="flex-row items-center"
            >
              <View className="h-12 w-12 bg-white/20 rounded-full items-center justify-center border-2 border-white/30 mr-3 backdrop-blur-md">
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View>
                <Text className="text-gray-300 text-xs font-bold uppercase">
                  Welcome Back
                </Text>
                <Text className="text-white text-xl font-bold">Alex</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push("/(member)/utilityPages/notifications")
              }
              className="bg-white/20 p-2.5 rounded-full relative backdrop-blur-md border border-white/10"
            >
              <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full z-10 border border-white/20" />
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
            </Pressable>
          </View>

          {/* Hero Greeting Text */}
          <View className="px-2">
            <Text className="text-white/80 font-medium text-base mb-1">
              Your Financial Overview
            </Text>
            <Text className="text-white font-black text-3xl shadow-sm">
              Dashboard
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 -mt-20"
        showsVerticalScrollIndicator={false}
      >
        {/* 3. THE FLOATING PORTFOLIO CARD */}
        <View className="mb-6 z-10 mx-6">
          <View className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-900/5 border border-slate-100">
            {/* TOP SECTION */}
            <View className="mb-5">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-slate-500 text-xs font-semibold tracking-wide">
                  Account Summary
                </Text>
                <Pressable onPress={() => setShowBalance(!showBalance)}>
                  <Ionicons
                    name={showBalance ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color="#94a3b8"
                  />
                </Pressable>
              </View>

              <Text className="text-center text-[34px] font-extrabold text-arch-blue tracking-tight">
                {showBalance ? "UGX 4.5M" : "••••••••"}
              </Text>
            </View>

            {/* DIVIDER */}
            <View className="h-px bg-slate-100 mb-5" />

            {/* BOTTOM ROW */}
            <View className="flex-row justify-between">
              {/* Savings */}
              <View className="flex-1 flex-row items-center">
                <View className="bg-slate-100 p-2.5 rounded-xl mr-3">
                  <Ionicons name="lock-closed" size={18} color="#334155" />
                </View>
                <View>
                  <Text className="text-slate-500 text-[11px] font-medium">
                    Locked Savings
                  </Text>
                  <Text className="text-slate-900 font-semibold text-sm">
                    {showBalance ? "UGX 1.5M" : "•••"}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View className="w-px bg-slate-100 mx-3" />

              {/* Loan */}
              <View className="flex-1 flex-row items-center justify-end">
                <View className="mr-3 items-end">
                  <Text className="text-slate-500 text-[11px] font-medium">
                    Active Loan
                  </Text>
                  <Text className="text-slate-900 font-semibold text-sm">
                    {showBalance ? "UGX 1.2M" : "•••"}
                  </Text>
                </View>
                <View className="bg-slate-100 p-2.5 rounded-xl">
                  <Ionicons name="swap-vertical" size={18} color="#334155" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View className="mb-8 bg-gray-50 pt-4 rounded-t-3xl px-6">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-lg font-bold text-slate-800">
              Member Services
            </Text>
            <Pressable
              onPress={() => router.push("/(member)/services/support")}
            >
              <Text className="text-xs font-semibold text-[#10b981]">
                Need Help?
              </Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {/* ACTION 1: Loan GUARANTOR STATUS */}
            <ServiceCard
              icon="shield-checkmark-outline"
              label="Guarantors"
              subLabel="Who Approves My loan?"
              iconColor="#07193f"
              bg="bg-slate-50"
              onPress={() => router.push("/(member)/services/guarantors")}
            />

            {/* ACTION 2: DIGITAL STATEMENT  */}
            <ServiceCard
              icon="document-text-outline"
              label="E-Statement"
              subLabel="Download PDF"
              iconColor="#07193f"
              bg="bg-slate-50"
              onPress={() => router.push("/(member)/services/statement")}
            />

            {/* ACTION 3: BENEFICIARY */}
            <ServiceCard
              icon="people-outline"
              label="Beneficiaries"
              subLabel="Update Records"
              iconColor="#07193f"
              bg="bg-slate-50"
              onPress={() => router.push("/(member)/services/beneficiary")}
            />

            {/* ACTION 4: SACCO NEWS */}
            <ServiceCard
              icon="megaphone-outline"
              label="Announcements"
              subLabel="SACCO Updates"
              iconColor="#10b981"
              bg="bg-emerald-50"
              onPress={() => router.push("/(member)/services/news")}
            />
          </View>
        </View>

        {/* LOAN ELIGIBILITY WIDGET */}
        <View className="bg-green-50/50 border border-blue-100 rounded-2xl p-4 mb-6 flex-row items-center mx-6">
          <View className="flex-1 mr-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-green-900 font-bold text-sm">
                Loan Limit
              </Text>
              <Text className="text-green-700 font-bold text-sm">UGX 5M</Text>
            </View>
            {/* Progress Bar */}
            <View className="h-2 bg-green-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="text-green-400 text-[10px] mt-1.5">
              You can borrow up to{" "}
              <Text className="font-bold text-green-600">UGX 3.8M</Text> more.
            </Text>
          </View>
          <Pressable
            onPress={() => setIsLoanFormVisible(true)}
            className="bg-green-600 px-4 py-2 rounded-xl shadow-sm shadow-blue-500/30"
          >
            <Text className="text-white font-bold text-xs">Apply</Text>
          </Pressable>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View className="mb-20 bg-white rounded-3xl p-5 shadow-sm mx-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Recent Transactions
            </Text>
            <Text className="text-arch-blue text-sm font-semibold">
              See All
            </Text>
          </View>

          <TransactionItem
            icon="arrow-up-circle"
            iconColor="text-emerald-500"
            bg="bg-emerald-50"
            title="Monthly Savings"
            date="Today, 10:23 AM"
            amount="+ UGX 50,000"
            amountColor="text-emerald-600"
          />
          <TransactionItem
            icon="arrow-down-circle"
            iconColor="text-slate-600"
            bg="bg-slate-100"
            title="Loan Repayment"
            date="Yesterday"
            amount="- UGX 120,000"
            amountColor="text-slate-800"
          />
          <TransactionItem
            icon="gift-outline"
            iconColor="text-purple-500"
            bg="bg-purple-50"
            title="Welfare Contribution"
            date="24 Sept 2023"
            amount="- UGX 10,000"
            amountColor="text-gray-600"
          />
        </View>
        <Modal visible={isLoanFormVisible} transparent animationType="slide">
          <LoanApplicationForm onClose={() => setIsLoanFormVisible(false)} />
        </Modal>
      </ScrollView>
    </View>
  );
}
