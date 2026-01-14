import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuickAction from "../../../components/ui/QuickAction";
import TransactionItem from "../../../components/ui/TransactionItem";

export default function MemberDashboard() {
  const [showBalance, setShowBalance] = useState(true);

  // Mock Data for "Real World" simulation
  const loanLimit = 5000000;
  const currentLoan = 1200000;
  const progress = (currentLoan / loanLimit) * 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* BACKGROUND HEADER */}
      <View className="absolute top-0 w-full h-80 bg-arch-blue rounded-b-[40px]" />

      {/* TOP HEADER */}
      <View className="pt-4 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View className="h-12 w-12 bg-white/20 rounded-full items-center justify-center border-2 border-white/30 mr-3">
              <Ionicons name="person" size={24} color="#FFF" />
            </View>
            <View>
              <Text className="text-white/80 text-xs font-medium uppercase tracking-wider">
                Member ID: 0428
              </Text>
              <Text className="text-white text-xl font-bold">Hello, Alex</Text>
            </View>
          </View>

          <Pressable className="bg-white/20 p-2 rounded-full relative">
            <View className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full z-10 border border-arch-blue" />
            <Ionicons name="notifications-outline" size={24} color="#FFF" />
          </Pressable>
        </View>

        {/* MAIN PORTFOLIO CARD */}
        <View className="bg-white rounded-3xl p-6 shadow-lg shadow-blue-900/20">
          {/* Header Row */}
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-gray-500 text-xs font-bold uppercase ">
                Total Savings
              </Text>
            </View>
            <Pressable
              onPress={() => setShowBalance(!showBalance)}
              className="bg-gray-50 rounded-full"
            >
              <Ionicons
                name={showBalance ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#64748B"
              />
            </Pressable>
          </View>

          <Text className="text-3xl font-extrabold text-white text-center p-1 rounded-full w-full bg-arch-blue">
            {showBalance ? "UGX 4.5M" : "••••••••"}
          </Text>

          {/* Divider */}
          <View className="h-[1px] bg-gray-100 w-full my-2" />

          {/* Loan Status Row */}
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <View className="bg-red-50 p-2 rounded-lg mr-3">
                <Ionicons name="trending-down" size={20} color="#EF4444" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs">Active Loan</Text>
                <Text className="text-gray-800 font-bold text-base">
                  {showBalance ? "UGX 1.2M" : "••••••"}
                </Text>
              </View>
            </View>

            <View className="bg-orange-50 px-3 py-2 rounded-xl border border-orange-100">
              <Text className="text-orange-600 text-[10px] font-bold uppercase mb-0.5">
                Next Payment
              </Text>
              <Text className="text-orange-800 font-bold text-xs">
                Oct 24th
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 -mt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* LOAN ELIGIBILITY WIDGET */}
        <View className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6 flex-row items-center">
          <View className="flex-1 mr-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-blue-900 font-bold text-sm">
                Loan Limit
              </Text>
              <Text className="text-blue-700 font-bold text-sm">UGX 5M</Text>
            </View>
            {/* Progress Bar */}
            <View className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="text-blue-400 text-[10px] mt-1.5">
              You can borrow up to{" "}
              <Text className="font-bold text-blue-600">UGX 3.8M</Text> more.
            </Text>
          </View>
          <Pressable className="bg-blue-600 px-4 py-2 rounded-xl shadow-sm shadow-blue-500/30">
            <Text className="text-white font-bold text-xs">Apply</Text>
          </Pressable>
        </View>

        {/* QUICK ACTIONS */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            <QuickAction
              icon="add-circle-outline"
              label="Save"
              color="#FFFFFF"
              bg="bg-emerald-500"
            />
            <QuickAction
              icon="card-outline"
              label="Pay Loan"
              color="#FFFFFF"
              bg="bg-slate-700"
            />
            <QuickAction
              icon="calculator-outline"
              label="Calculator"
              color="#FFF"
              bg="bg-arch-blue"
            />
            <QuickAction
              icon="receipt-outline"
              label="Statement"
              color="#FFF"
              bg="bg-arch-blue"
            />
          </View>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View className="mb-10 bg-white rounded-3xl p-5 shadow-sm">
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
      </ScrollView>
    </SafeAreaView>
  );
}
