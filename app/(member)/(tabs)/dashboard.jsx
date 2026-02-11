import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import { useMemberApplication } from "@/hooks/memberHooks/useMemberApplication";
import { useUnreadNotificationCount } from "@/hooks/sharedHooks/useUnreadNotificationCount";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "../../../components/cards/ServiceCard";
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";
import TransactionItem from "../../../components/ui/memberUI/TransactionItem";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function MemberDashboard() {
  const { theme, mode } = useTheme();
  const [showBalance, setShowBalance] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);
  const unreadCount = useUnreadNotificationCount();
  const router = useRouter();

  const { profile, balances, transactions, loans } = useMemberAllInfo();

  const { user } = useAuth();
  const { data: application } = useMemberApplication(user?.id);

  const applicationStatus = application?.status ?? "pending";
  const isApproved = applicationStatus === "approved";

  const PREVIEW_LIMIT = 3;

  const displayedTransactions = useMemo(() => {
    if (!transactions) return [];

    return isExpanded ? transactions : transactions.slice(0, PREVIEW_LIMIT);
  }, [transactions, isExpanded]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

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

  const activeLoanObj = loans?.find((l) => l.status === "Disbursed") || {};

  const dashboardData = useMemo(() => {
    const activeLoanObj = loans?.find((l) => l.status === "Disbursed") || {};
    const savings = balances.Savings || 0;
    const shares = balances.Shares || 0;
    const fixed = balances.Fixed_Deposit || 0;
    const loanBalance = activeLoanObj.outstanding_balance || 0;
    const limit = savings + savings / 2;

    return {
      name: profile?.first_name || user.full_name || "Member",
      totalBalance: savings + shares + fixed,
      lockedSavings: fixed,
      activeLoan: loanBalance,
      loanLimit: limit,
      progress: limit > 0 ? (loanBalance / limit) * 100 : 0,
    };
  }, [balances, loans, profile, user]);

  const renderHeader = () => {
    return (
      <View>
        {/* PORTFOLIO CARD */}
        <View className="mb-6 z-10 mx-6">
          <View
            style={{
              backgroundColor: theme.card,
              borderColor: mode === "dark" ? theme.border : theme.gray50,
              shadowColor: theme.shadow,
            }}
            className="rounded-3xl p-6 shadow-md border"
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
                {showBalance
                  ? formatCurrency(dashboardData.totalBalance)
                  : "••••••••"}
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
                    {showBalance
                      ? formatCurrency(dashboardData.lockedSavings)
                      : "•••"}
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
                    {showBalance
                      ? formatCurrency(dashboardData.activeLoan)
                      : "•••"}
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
        {application && applicationStatus !== "approved" && (
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
                {formatCurrency(dashboardData.loanLimit)}
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
                UGX{" "}
                {(
                  dashboardData.loanLimit - activeLoanObj?.outstanding_balance
                ).toLocaleString()}
              </Text>{" "}
              more.
            </Text>
          </View>
          <Pressable
            disabled={!isApproved}
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
          className="rounded-t-3xl p-5 shadow-sm mx-6"
        >
          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-6">
            <Text style={{ color: theme.text }} className="text-lg font-bold">
              Recent Activity
            </Text>

            {transactions?.length > PREVIEW_LIMIT && (
              <Pressable
                onPress={toggleExpand}
                hitSlop={15}
                className="bg-primary/10 px-3 py-1 rounded-full"
                style={{ backgroundColor: theme.primary + "15" }}
              >
                <Text
                  style={{ color: theme.primary }}
                  className="text-xs font-bold"
                >
                  {isExpanded ? "Show Less" : "See All"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTransactionItem = useCallback(
    ({ item }) => (
      <View style={{ backgroundColor: theme.card }} className="mx-6 px-5 py-0">
        <TransactionItem item={item} />
      </View>
    ),
    [theme],
  );

  const renderEmptyComponent = () => (
    <View
      style={{ backgroundColor: theme.card }}
      className="mx-6 p-5 rounded-b-3xl items-center pb-10"
    >
      <View
        style={{ backgroundColor: theme.gray50 }}
        className="p-4 rounded-full mb-4"
      >
        <Ionicons name="receipt-outline" size={32} color={theme.gray300} />
      </View>
      <Text style={{ color: theme.text }} className="font-bold text-base">
        No transactions yet
      </Text>
      <Text
        style={{ color: theme.gray400 }}
        className="text-xs text-center px-10 mt-1"
      >
        Your financial activity will appear here once you start saving.
      </Text>
    </View>
  );

  const renderFooter = () =>
    transactions?.length > 0 && (
      <View
        style={{ backgroundColor: theme.card }}
        className="mx-6 h-6 rounded-b-3xl mb-20"
      />
    );

  return (
    <View style={{ backgroundColor: theme.background }} className="flex-1">
      {/* 1. HEADER BACKGROUND */}
      <View className="relative w-full h-80 rounded-b-[20px] overflow-hidden z-0">
        <Image
          source={require("../../../assets/images/welcome.png")}
          style={{
            width: "100%",
            height: "100%",
          }}
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
            <Text className="text-white font-black text-3xl">Dashboard</Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="flex-1 -mt-20">
        <FlatList
          data={displayedTransactions}
          keyExtractor={(item) =>
            item.id || item.created_at || Math.random().toString()
          }
          renderItem={renderTransactionItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />

        <Modal visible={isLoanFormVisible} transparent animationType="slide">
          <LoanApplicationForm onClose={() => setIsLoanFormVisible(false)} />
        </Modal>
      </View>
    </View>
  );
}
