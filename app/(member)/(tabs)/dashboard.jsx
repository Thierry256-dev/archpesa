import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import { useMemberApplication } from "@/hooks/useMemberApplication";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "../../../components/cards/ServiceCard";
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";
import TransactionItem from "../../../components/ui/TransactionItem";
import { MOCK_TRANSACTIONS } from "../../../constants/data";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";

export default function MemberDashboard() {
  const { theme } = useTheme();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);
  const unreadCount = useUnreadNotificationCount();
  const router = useRouter();

  const { profile, balances } = useMemberAllInfo();

  const { user } = useAuth();
  const { data: application } = useMemberApplication(user?.id);

  const applicationStatus = application?.status ?? "pending";
  const isApproved = applicationStatus === "approved";

  const statusConfig = {
    pending: {
      label: "Application Under Review",
      description: "Your SACCO application is being reviewed.",
      color: theme.orange + "15",
      borderColor: theme.orange + "30",
      icon: "time-outline",
      iconColor: theme.orange,
    },
    rejected: {
      label: "Application Requires Update",
      description: "Some details need correction. Tap to update and resubmit.",
      color: theme.rose + "15",
      borderColor: theme.rose + "30",
      icon: "alert-circle-outline",
      iconColor: theme.rose,
    },
  };

  const statusUI = statusConfig[applicationStatus];

  const dashboardData = {
    name: profile?.first_name,
    totalBalance: balances.Savings + balances.Shares + balances.Fixed_Deposit,
    lockedSavings: balances?.Fixed_Deposit,
    activeLoan: balances?.Loan,
    loanLimit: balances.Savings / 2,
    currentLoan: balances.Loan,
    progress: (balances.Loan / (balances.Savings / 2)) * 100,
  };

  return (
    <View style={{ backgroundColor: theme.background }} className="flex-1">
      {/* 1. HEADER BACKGROUND */}
      <View className="relative w-full h-80 rounded-b-[20px] overflow-hidden z-0">
        <Image
          source={require("../../../assets/images/welcome.png")}
          className="w-full h-full object-cover"
        />
        <View className="absolute inset-0 bg-black/40" />
      </View>

      {/* 2. FOREGROUND CONTENT */}
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
              <View>
                <Text className="text-gray-300 text-xs font-bold uppercase">
                  Welcome Back
                </Text>
                <Text className="text-white text-xl font-bold">
                  {dashboardData.name}
                </Text>
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
        {/* 3. PORTFOLIO CARD */}
        <View className="mb-6 z-10 mx-6">
          <View
            style={{
              backgroundColor: theme.card,
              borderColor: theme.border,
              shadowColor: theme.shadow,
            }}
            className="rounded-3xl p-6 shadow-lg border"
          >
            <View className="mb-5">
              <View className="flex-row justify-between items-center mb-1">
                <Text
                  style={{ color: theme.gray500 }}
                  className="text-xs font-semibold tracking-wide"
                >
                  Account Summary
                </Text>
                <Pressable onPress={() => setShowBalance(!showBalance)}>
                  <Ionicons
                    name={showBalance ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={theme.gray400}
                  />
                </Pressable>
              </View>
              <Text
                style={{ color: theme.text }}
                className="text-center text-[34px] font-extrabold tracking-tight"
              >
                {showBalance ? "UGX " + dashboardData.totalBalance : "••••••••"}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: theme.border,
              }}
              className="h-px mb-5"
            />

            <View className="flex-row justify-between">
              <View className="flex-1 flex-row items-center">
                <View
                  style={{ backgroundColor: theme.gray100 }}
                  className="p-2.5 rounded-xl mr-3"
                >
                  <Ionicons
                    name="lock-closed"
                    size={18}
                    color={theme.gray700}
                  />
                </View>
                <View>
                  <Text
                    style={{ color: theme.gray500 }}
                    className="text-[11px] font-medium"
                  >
                    Locked Savings
                  </Text>
                  <Text
                    style={{ color: theme.text }}
                    className="font-semibold text-sm"
                  >
                    {showBalance ? "UGX " + dashboardData.lockedSavings : "•••"}
                  </Text>
                </View>
              </View>

              <View
                style={{ backgroundColor: theme.gray100 }}
                className="w-px mx-3"
              />

              <View className="flex-1 flex-row items-center justify-end">
                <View className="mr-3 items-end">
                  <Text
                    style={{ color: theme.gray500 }}
                    className="text-[11px] font-medium"
                  >
                    Active Loan
                  </Text>
                  <Text
                    style={{ color: theme.text }}
                    className="font-semibold text-sm"
                  >
                    {showBalance ? "UGX " + dashboardData.activeLoan : "•••"}
                  </Text>
                </View>
                <View
                  style={{ backgroundColor: theme.gray100 }}
                  className="p-2.5 rounded-xl"
                >
                  <Ionicons
                    name="swap-vertical"
                    size={18}
                    color={theme.gray700}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* STATUS ALERT */}
        {applicationStatus !== "approved" && (
          <Pressable
            disabled={applicationStatus !== "rejected"}
            onPress={() => router.push("/(member)/services/review")}
            style={{
              backgroundColor: statusUI.color,
              borderColor: statusUI.borderColor,
            }}
            className="mx-6 mb-6 p-4 rounded-2xl border"
          >
            <View className="flex-row items-center">
              <Ionicons
                name={statusUI.icon}
                size={26}
                color={statusUI.iconColor}
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <Text
                  style={{ color: theme.text }}
                  className="font-bold text-sm"
                >
                  {statusUI.label}
                </Text>
                <Text style={{ color: theme.gray600 }} className="text-xs mt-1">
                  {statusUI.description}
                </Text>
              </View>
              {applicationStatus === "rejected" && (
                <Text
                  style={{ color: theme.rose }}
                  className="font-semibold text-xs"
                >
                  Update →
                </Text>
              )}
            </View>
          </Pressable>
        )}

        {/* QUICK ACTIONS */}
        <View
          style={{ backgroundColor: theme.background }}
          className="mb-8 pt-4 px-6"
        >
          <View className="flex-row justify-between items-end mb-4">
            <Text style={{ color: theme.text }} className="text-lg font-bold">
              Member Services
            </Text>
            <Pressable
              onPress={() => router.push("/(member)/services/support")}
            >
              <Text
                style={{ color: theme.emerald }}
                className="text-xs font-semibold"
              >
                Need Help?
              </Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            <ServiceCard
              icon="shield-checkmark-outline"
              label="Guarantors"
              subLabel="Approval Status"
              iconColor={theme.primary}
              onPress={() => router.push("/(member)/services/guarantors")}
            />
            <ServiceCard
              icon="document-text-outline"
              label="E-Statement"
              subLabel="Download PDF"
              iconColor={theme.primary}
              onPress={() => router.push("/(member)/services/statement")}
            />
            <ServiceCard
              icon="people-outline"
              label="Beneficiaries"
              subLabel="Update Records"
              iconColor={theme.primary}
              onPress={() => router.push("/(member)/services/beneficiary")}
            />
            <ServiceCard
              icon="megaphone-outline"
              label="Announcements"
              subLabel="SACCO Updates"
              iconColor={theme.emerald}
              onPress={() => router.push("/(member)/services/news")}
            />
          </View>
        </View>

        {/* LOAN ELIGIBILITY */}
        <View
          style={{
            backgroundColor: theme.emerald + "10",
            borderColor: theme.emerald + "30",
          }}
          className="border rounded-2xl p-4 mb-6 flex-row items-center mx-6"
        >
          <View className="flex-1 mr-4">
            <View className="flex-row justify-between mb-2">
              <Text
                style={{ color: theme.emerald }}
                className="font-bold text-sm"
              >
                Loan Limit
              </Text>
              <Text
                style={{ color: theme.emerald }}
                className="font-bold text-sm"
              >
                UGX {dashboardData.loanLimit}
              </Text>
            </View>
            <View
              style={{ backgroundColor: theme.emerald + "30" }}
              className="h-2 rounded-full overflow-hidden"
            >
              <View
                style={{
                  width: `${dashboardData.progress}%`,
                  backgroundColor: theme.emerald,
                }}
                className="h-full rounded-full"
              />
            </View>
            <Text
              style={{ color: theme.gray500 }}
              className="text-[10px] mt-1.5"
            >
              You can borrow up to
              <Text style={{ color: theme.emerald }} className="font-bold">
                UGX {dashboardData.loanLimit - balances.Loan}
              </Text>{" "}
              more.
            </Text>
          </View>
          <Pressable
            disabled={!isApproved || balances.Loan > balances.Savings / 2}
            onPress={() => isApproved && setIsLoanFormVisible(true)}
            style={{ backgroundColor: theme.emerald }}
            className="px-4 py-2 rounded-xl shadow-sm"
          >
            <Text className="text-white font-bold text-xs">Apply</Text>
          </Pressable>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View
          style={{ backgroundColor: theme.card }}
          className="mb-20 rounded-3xl p-5 shadow-sm mx-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ color: theme.text }} className="text-lg font-bold">
              Recent Activity
            </Text>
            <Text
              style={{ color: theme.primary }}
              className="text-sm font-semibold"
            >
              See All
            </Text>
          </View>
          {MOCK_TRANSACTIONS.length > 0 ? (
            MOCK_TRANSACTIONS.map((item, index) => (
              <TransactionItem key={index} item={item} />
            ))
          ) : (
            <View className="items-center py-10">
              <Ionicons
                name="receipt-outline"
                size={32}
                color={theme.gray300}
              />
              <Text
                style={{ color: theme.text }}
                className="font-bold text-base mt-4"
              >
                No transactions yet
              </Text>
            </View>
          )}
        </View>

        <Modal visible={isLoanFormVisible} transparent animationType="slide">
          <LoanApplicationForm onClose={() => setIsLoanFormVisible(false)} />
        </Modal>
      </ScrollView>
    </View>
  );
}
