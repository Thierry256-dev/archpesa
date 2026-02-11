import { useTheme } from "@/context/ThemeProvider";
import { useUnreadNotificationCount } from "@/hooks/sharedHooks/useUnreadNotificationCount";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AlertCard,
  QuickAction,
} from "../../../components/ui/adminUI/adminDasboardSubComponents";
import { ROLE_CONFIG } from "../../../constants/roles";
import useAdminAllInfo from "../../../hooks/useAdminAllInfo";
import { computeSaccoTotals } from "../../../services/adminServices/financeCalculations";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function AdminDashboard() {
  const { theme } = useTheme();
  const unreadCount = useUnreadNotificationCount();
  const [showBalance, setShowBalance] = useState(true);
  const router = useRouter();
  const adminRole = "treasurer";
  const roleConfig = ROLE_CONFIG[adminRole];

  const { members } = useAdminAllInfo();

  const totals = useMemo(() => {
    return computeSaccoTotals(members);
  }, [members]);

  return (
    <View style={{ backgroundColor: theme.background }} className="flex-1">
      <View className="relative w-full h-80 rounded-b-[20px] overflow-hidden z-0">
        <Image
          source={require("../../../assets/images/welcome.png")}
          className="w-full h-full object-cover"
        />
        <View className="absolute inset-0 bg-black/40" />
      </View>

      <SafeAreaView className="absolute top-0 w-full">
        <View className="px-6 pt-4">
          <View className="flex-row items-center justify-between mb-8">
            <Pressable
              onPress={() => router.push("/utilityPages/profile")}
              className="flex-row items-center"
            >
              <View className="h-12 w-12 bg-white/20 rounded-full items-center justify-center border-2 border-white/30 mr-3 backdrop-blur-md">
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-300 text-xs font-bold uppercase mr-2">
                  {roleConfig.label}
                </Text>
                <View
                  style={{ backgroundColor: theme.emerald + "40" }}
                  className="px-2 py-0.5 rounded-full"
                >
                  <Text
                    style={{ color: theme.emerald }}
                    className="text-[10px] font-bold"
                  >
                    {roleConfig.badge}
                  </Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/utilityPages/notifications")}
              className="bg-white/20 p-2.5 rounded-full relative backdrop-blur-md border border-white/10"
            >
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full px-1.5">
                  <Text className="text-white text-[10px] font-bold">
                    {unreadCount}
                  </Text>
                </View>
              )}
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
            </Pressable>
          </View>

          <View className="px-2">
            <Text className="text-white/80 font-medium text-base mb-1">
              UMOJA SACCO
            </Text>
            <Text className="text-white font-black text-3xl shadow-sm">
              Admin Dashboard
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 -mt-20 rounded-3xl"
        showsVerticalScrollIndicator={false}
      >
        {/* SACCO VALUE CARD */}
        <View
          style={{ backgroundColor: theme.card, shadowColor: theme.shadow }}
          className="rounded-3xl p-6 mx-6 shadow-lg mb-8"
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text
              style={{ color: theme.gray500 }}
              className="text-sm font-semibold"
            >
              TOTAL SACCO VALUE
            </Text>
            <Pressable
              onPress={() => setShowBalance(!showBalance)}
              style={{ backgroundColor: theme.gray100 }}
              className="p-2 rounded-lg"
            >
              <Ionicons
                name={showBalance ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={theme.gray600}
              />
            </Pressable>
          </View>

          <Text
            style={{ color: theme.primary }}
            className="text-3xl text-center font-extrabold mb-4"
          >
            {showBalance
              ? `${formatCurrency(totals.totalSaccoValue)}`
              : "••••••••••"}
          </Text>

          <View
            style={{ borderTopColor: theme.gray200 }}
            className="flex-row justify-between border-t pt-4"
          >
            <View>
              <Text
                style={{ color: theme.gray400 }}
                className="text-xs text-center"
              >
                Cash at Hand
              </Text>
              <Text
                style={{ color: theme.text }}
                className="text-lg font-semibold mt-1"
              >
                {showBalance
                  ? `${formatCurrency(totals.cashAtHand)}`
                  : "••••••"}
              </Text>
            </View>
            <View>
              <Text
                style={{ color: theme.gray400 }}
                className="text-xs text-center"
              >
                Total Savings
              </Text>
              <Text
                style={{ color: theme.text }}
                className="text-lg font-semibold mt-1"
              >
                {showBalance
                  ? `${formatCurrency(totals.totalSavings)}`
                  : "••••••"}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6">
          <View className="mb-8">
            <Text
              style={{ color: theme.text }}
              className="text-lg font-bold mb-4"
            >
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <QuickAction
                icon="person-add-outline"
                label="Register Forms"
                color={theme.purple}
                onPress={() =>
                  router.push("/(admin)/applications/memberRegistration")
                }
              />
              <QuickAction
                icon="cash-outline"
                label="Loan Forms"
                color={theme.orange}
                onPress={() =>
                  router.push("/(admin)/applications/loanApplications")
                }
              />
            </View>
          </View>

          <View className="mb-12">
            <View className="flex-row justify-between items-center mb-4">
              <Text style={{ color: theme.text }} className="text-lg font-bold">
                Attention Needed
              </Text>
              <View
                style={{ backgroundColor: theme.rose + "20" }}
                className="px-3 py-1.5 rounded-full"
              >
                <Text
                  style={{ color: theme.rose }}
                  className="text-sm font-bold"
                >
                  3 Alerts
                </Text>
              </View>
            </View>

            <View className="gap-y-3">
              <AlertCard
                icon="alert-circle-outline"
                iconColor={theme.rose}
                bgColor={theme.rose + "10"}
                title="Kabazi Fred"
                subtitle="Loan overdue by 3 days"
                status="overdue"
                amount="UGX 50k"
                action="Call"
              />
              <AlertCard
                icon="document-text-outline"
                iconColor={theme.primary}
                bgColor={theme.primary + "10"}
                title="Sarah K."
                subtitle="Loan pending"
                status="pending"
                amount="UGX 20k"
                action="Review"
              />
            </View>
          </View>

          <View className="mb-20">
            <Text
              style={{ color: theme.text }}
              className="text-lg font-bold mb-4"
            >
              Recent Activity
            </Text>
            <View
              style={{ backgroundColor: theme.card }}
              className="rounded-2xl p-4"
            >
              <ActivityItem
                icon="checkmark-circle-outline"
                color={theme.emerald}
                title="Loan Approved"
                description="Jane M. • UGX 15,000"
                time="2h ago"
                theme={theme}
              />
              <ActivityItem
                icon="arrow-down-circle-outline"
                color={theme.primary}
                title="Deposit Received"
                description="Peter K. • UGX 5,000"
                time="Yesterday"
                theme={theme}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ActivityItem({ icon, color, title, description, time, theme }) {
  return (
    <View
      style={{ borderBottomColor: theme.gray100 }}
      className="flex-row items-center py-3 border-b last:border-b-0"
    >
      <Ionicons name={icon} size={24} color={color} />
      <View className="ml-3 flex-1">
        <Text style={{ color: theme.text }} className="font-medium">
          {title}
        </Text>
        <Text style={{ color: theme.gray500 }} className="text-sm">
          {description}
        </Text>
      </View>
      <Text style={{ color: theme.gray400 }} className="text-xs">
        {time}
      </Text>
    </View>
  );
}
