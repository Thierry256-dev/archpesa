import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AlertCard from "../../../components/ui/AlertCard";
import QuickAction from "../../../components/ui/QuickAction";

export default function AdminDashboard() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="absolute top-0 w-full h-80 bg-arch-blue rounded-b-[40px]" />

      <View className=" pt-15 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-white/80 text-sm font-medium">
              Admin Dashboard
            </Text>
            <Text className="text-white text-2xl font-bold">Umoja SACCO</Text>
          </View>
          <Pressable className="bg-white/20 p-2 rounded-xl">
            <Ionicons name="settings-outline" size={22} color="#FFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 -mt-6" showsVerticalScrollIndicator={false}>
        {/* HEALTH CHECK CARD  */}
        <View className="bg-white rounded-3xl p-6 mx-6 shadow-lg mb-8">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-500 text-sm font-semibold">
              TOTAL SACCO VALUE
            </Text>
            <Pressable
              onPress={() => setShowBalance(!showBalance)}
              className="bg-gray-100 p-2 rounded-lg"
            >
              <Ionicons
                name={showBalance ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#64748B"
              />
            </Pressable>
          </View>

          <Text className="text-3xl text-center font-extrabold text-white p-1 rounded-full bg-arch-blue mb-4">
            {showBalance ? "UGX 125.4M" : "••••••••••"}
          </Text>

          {/* Breakdown Row */}
          <View className="flex-row justify-between border-t border-gray-300">
            <View>
              <Text className="text-gray-400 text-xs text-center">
                Cash at Hand
              </Text>
              <Text className="text-lg font-semibold text-arch-blue p-1 mt-1">
                {showBalance ? "UGX 36.2M" : "••••••••••"}
              </Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs text-center">
                Total Savings
              </Text>
              <Text className="text-lg font-semibold text-arch-blue p-1 mt-1">
                {showBalance ? "UGX 89.2M" : "••••••••••"}
              </Text>
            </View>
          </View>

          {/* Growth Indicator */}
          <View className="flex-row items-center mt-4 bg-green-50 self-start px-3 py-1.5 rounded-full">
            <Ionicons name="trending-up" size={16} color="#10B981" />
            <Text className="text-green-700 font-bold text-xs ml-1.5">
              +2.4% this month
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-3xl px-6">
          {/* QUICK ACTIONS */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <QuickAction
                icon="wallet-outline"
                label="Record `Deposit"
                color="#10B981"
                bg="bg-arch-blue"
              />
              <QuickAction
                icon="cash-outline"
                label="Issue Loan"
                color="#0F4C88"
                bg="bg-arch-blue"
              />
              <QuickAction
                icon="person-add-outline"
                label="Add Member"
                color="#7C3AED"
                bg="bg-arch-blue"
              />
              <QuickAction
                icon="bar-chart-outline"
                label="View Reports"
                color="#F59E0B"
                bg="bg-arch-blue"
              />
            </View>
          </View>

          {/* ATTENTION NEEDED */}
          <View className="mb-12">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Attention Needed
              </Text>
              <View className="bg-red-100 px-3 py-1.5 rounded-full">
                <Text className="text-red-700 text-sm font-bold">3 Alerts</Text>
              </View>
            </View>

            <View className="space-y-3">
              {/* Overdue Alert */}
              <AlertCard
                icon="alert-circle-outline"
                iconColor="#EF4444"
                bgColor="bg-red-50"
                title="John Doe"
                subtitle="Loan overdue by 3 days"
                status="overdue"
                amount="UGX 50,000"
                action="Call Member"
              />

              {/* Approval Request */}
              <AlertCard
                icon="document-text-outline"
                iconColor="#2563EB"
                bgColor="bg-blue-50"
                title="Sarah K."
                subtitle="Loan application pending"
                status="pending"
                amount="UGX 20,000"
                action="Review"
              />

              {/* Low Balance Alert */}
              <AlertCard
                icon="warning-outline"
                iconColor="#F59E0B"
                bgColor="bg-amber-50"
                title="Emergency Fund"
                subtitle="Balance below threshold"
                status="warning"
                amount=""
                action="Top Up"
              />
            </View>
          </View>

          {/* 4. RECENT ACTIVITY SECTION (Optional Addition) */}
          <View className="mb-10">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Recent Activity
            </Text>
            <View className="bg-white rounded-2xl p-4">
              <ActivityItem
                icon="checkmark-circle-outline"
                color="text-emerald-600"
                title="Loan Approved"
                description="Jane M. • UGX 15,000"
                time="2 hours ago"
              />
              <ActivityItem
                icon="arrow-down-circle-outline"
                color="text-blue-600"
                title="Deposit Received"
                description="Peter K. • UGX 5,000"
                time="Yesterday"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Reusable Activity Item Component */
function ActivityItem({ icon, color, title, description, time }) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
      <Ionicons name={icon} size={24} className={color} />
      <View className="ml-3 flex-1">
        <Text className="font-medium text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-500">{description}</Text>
      </View>
      <Text className="text-xs text-gray-400">{time}</Text>
    </View>
  );
}
