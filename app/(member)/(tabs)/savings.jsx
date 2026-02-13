import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Custom Hooks & Context ---
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import { useMemberApplication } from "@/hooks/memberHooks/useMemberApplication";
import { useGrowthData } from "../../../hooks/memberHooks/useMemberGrowthData";
import { useSavingsGoals } from "../../../hooks/memberHooks/useSavingsGoals";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";

//utils
import { formatCurrency } from "../../../utils/formatCurrency";

// --- Components ---
import AddGoalModal from "@/components/ui/memberUI/AddGoalModal";
import TransactionItem from "@/components/ui/memberUI/TransactionItem";
import {
  ChartBar,
  CurrentGoal,
} from "@/components/ui/memberUI/savingsSmallComponents";

export default function MemberSavings() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);

  const { data: application } = useMemberApplication(user?.id);
  const { balances, transactions } = useMemberAllInfo();
  const { goals, loading: goalsLoading, addGoal } = useSavingsGoals();
  const growthData = useGrowthData(transactions);

  const isApproved = application?.status === "approved";
  const sharePrice = 10000;

  // 1. Sort & Filter Transactions
  const savingsTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions
      .filter((tx) =>
        ["Savings_Deposit", "Savings_Withdraw"].includes(tx.transaction_type),
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [transactions]);

  // 2. Chart Data
  const { chartData, maxValue } = useMemo(() => {
    const data = growthData.map((item) => ({
      value: item.closingBalance,
      label: item.month,
      dataPointText: item.closingBalance.toLocaleString(),
    }));
    const max = Math.max(...data.map((d) => d.value), 0);
    return { chartData: data, maxValue: max };
  }, [growthData]);

  // 3. Goal Progress Helper
  const getGoalProgress = useCallback(
    (goalTarget) => {
      if (!goals?.length) return { saved: 0, percent: 0 };

      const totalTargetSum = goals.reduce(
        (sum, g) => sum + Number(g.target_amount),
        0,
      );
      const currentSavings = Number(
        String(balances.Savings || "0").replace(/,/g, ""),
      );

      if (totalTargetSum === 0) return { saved: 0, percent: 0 };

      const fundedRatio = Math.min(currentSavings / totalTargetSum, 1);
      return {
        saved: goalTarget * fundedRatio,
        percent: Math.round(fundedRatio * 100),
      };
    },
    [goals, balances.Savings],
  );

  // --- Render Helpers ---
  const ListHeader = () => (
    <View className="px-6 pt-1 pb-4">
      {/* 1. ACCOUNTS CARDS */}
      <Text style={{ color: theme.text }} className="text-lg font-bold mb-4">
        Accounts
      </Text>
      <View className="mb-8">
        {/* Ordinary Savings */}
        <View
          style={{ backgroundColor: theme.primary, shadowColor: theme.primary }}
          className="p-5 rounded-3xl w-full shadow-lg mb-4"
        >
          <View className="flex-row justify-between items-start mb-6">
            <View className="bg-white/20 p-2 rounded-full">
              <Ionicons name="wallet-outline" size={24} color={theme.white} />
            </View>
            <View className="items-end">
              <Text
                style={{ color: theme.gray300 }}
                className="text-[10px] tracking-wide"
              >
                LOAN POWER
              </Text>
              <Text
                style={{ color: theme.white }}
                className="font-bold text-lg"
              >
                x1.5 Multiplier
              </Text>
            </View>
          </View>
          <Text
            style={{ color: theme.gray300 }}
            className="text-sm font-medium"
          >
            Ordinary Savings
          </Text>
          <Text
            style={{ color: theme.white }}
            className="text-2xl font-bold mb-1"
          >
            {formatCurrency(balances.Savings)}
          </Text>
          <Text
            style={{ color: theme.gray200 }}
            className="text-xs font-semibold bg-white/10 self-start px-2 py-1 rounded"
          >
            Liquid Cash
          </Text>
        </View>

        {/* Share Capital */}
        <View
          style={{ backgroundColor: theme.card, borderTopColor: theme.yellow }}
          className="p-5 rounded-3xl w-full shadow-sm border-t-4"
        >
          <View className="flex-row justify-between items-start mb-6">
            <View className="bg-amber-100 p-2 rounded-full">
              <Ionicons name="ribbon-outline" size={24} color={theme.yellow} />
            </View>
            <View className="items-end">
              <Text
                style={{ color: theme.gray400 }}
                className="text-xs font-bold"
              >
                SHARES OWNED
              </Text>
              <Text
                style={{ color: theme.text }}
                className="text-2xl font-bold mb-1"
              >
                {Number(balances.Shares / sharePrice).toLocaleString() || 0}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{ color: theme.gray500 }}
              className="text-sm font-medium"
            >
              Fixed Deposit
            </Text>
            <Text
              style={{ color: theme.text }}
              className="text-2xl font-bold mb-1"
            >
              {formatCurrency(balances.Fixed_Deposit)}
            </Text>
          </View>
          <Text
            style={{ color: theme.yellow }}
            className="text-xs font-semibold bg-amber-50 self-start px-2 py-1 rounded mt-2"
          >
            🔒 Non-Withdrawable
          </Text>
        </View>
      </View>

      {/* 2. SAVINGS GOALS SECTION */}
      <View className="mb-8">
        <Text style={{ color: theme.text }} className="text-lg font-bold mb-4">
          Current Goal(s)
        </Text>

        {goalsLoading ? (
          <ActivityIndicator color={theme.primary} />
        ) : !goals || goals.length === 0 ? (
          <View
            style={{
              borderColor: theme.border,
              backgroundColor: theme.card,
              borderStyle: "dashed",
              borderWidth: 2,
            }}
            className="p-10 rounded-[32px] items-center justify-center mt-4"
          >
            <View
              style={{ backgroundColor: theme.primary + "15" }}
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
            >
              <Ionicons
                name="sparkles-outline"
                size={40}
                color={theme.primary}
              />
            </View>
            <Text
              style={{ color: theme.text }}
              className="text-xl font-bold text-center mb-2"
            >
              Visualize Your Future
            </Text>
            <Text
              style={{ color: theme.gray500 }}
              className="text-sm text-center px-6 leading-5 mb-8"
            >
              You have not set any savings goals yet.
            </Text>
            <Pressable
              disabled={!isApproved}
              onPress={() => setIsGoalModalVisible(true)}
              style={{ backgroundColor: theme.primary }}
              className="px-8 py-3 rounded-2xl flex-row items-center shadow-sm"
            >
              <Ionicons
                name="add-circle"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-white font-bold ml-2">
                Create First Goal
              </Text>
            </Pressable>
          </View>
        ) : (
          <View>
            {goals.map((item, index) => {
              const stats = getGoalProgress(item.target_amount);
              return (
                <CurrentGoal
                  key={item.id || index}
                  title={item.goal_name}
                  target={item.target_amount}
                  saved={stats.saved}
                  percentage={stats.percent}
                  {...item}
                />
              );
            })}

            {/* Add New Goal Button */}
            <Pressable
              disabled={!isApproved}
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
              className="mt-4 border-2 border-dashed p-6 rounded-3xl items-center justify-center"
              onPress={() => setIsGoalModalVisible(true)}
            >
              <View
                style={{ backgroundColor: theme.gray100 }}
                className="p-4 rounded-full mb-3"
              >
                <Ionicons name="add" size={32} color={theme.purple} />
              </View>
              <Text
                style={{ color: theme.text }}
                className="font-bold text-base"
              >
                Create Another Goal
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* 3. GROWTH CHART */}
      <View
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
        className="p-6 rounded-3xl shadow-sm mb-8 border"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text style={{ color: theme.text }} className="font-black text-base">
            Growth History
          </Text>
          <View
            style={{ backgroundColor: theme.gray100 }}
            className="flex-row rounded-2xl p-2"
          >
            <Text style={{ color: theme.primary }} className="text-xs px-2">
              Max
            </Text>
            <Text
              style={{ color: theme.archTeal }}
              className="text-xs font-bold"
            >
              {maxValue.toLocaleString()}
            </Text>
          </View>
        </View>

        <View
          className="flex-row justify-between items-end w-full px-2"
          style={{ height: 180 }}
        >
          {chartData.length > 0 ? (
            chartData.map((item, index) => (
              <ChartBar
                key={index}
                label={item.label}
                value={item.value}
                dataPointText={item.dataPointText}
                maxValue={maxValue}
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text style={{ color: theme.gray400 }} className="text-xs">
                No data available
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 4. HISTORY TITLE */}
      <View className="flex-row justify-between items-center mb-2">
        <Text style={{ color: theme.text }} className="text-lg font-bold">
          History
        </Text>
      </View>
    </View>
  );

  const renderTransaction = useCallback(
    ({ item }) => (
      <View className="px-6">
        <TransactionItem item={item} />
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background }}
      className="flex-1 w-full max-w-md h-full md:h-[90vh] md:max-h-[850px]"
    >
      <View
        style={{ backgroundColor: theme.primary }}
        className="absolute top-0 w-full h-64 rounded-b-[40px]"
      />

      {/* Navigation Header */}
      <View className="px-6 pt-4 pb-2 flex-row gap-6 items-center z-10">
        <Pressable
          onPress={() => router.back()}
          className="bg-white/20 p-2 rounded-xl"
        >
          <Ionicons name="arrow-back" size={24} color={theme.white} />
        </Pressable>
        <Text
          style={{ color: theme.white }}
          className="text-center text-lg font-bold"
        >
          My Savings
        </Text>
      </View>

      {/* Main */}
      <View
        style={{ backgroundColor: theme.background }}
        className="flex-1 rounded-t-[30px] overflow-hidden mt-4 "
      >
        <FlatList
          data={savingsTransactions}
          keyExtractor={(item) => item.id || item.created_at}
          renderItem={renderTransaction}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View
              className="items-center justify-center py-10 mx-6 rounded-3xl border-2 border-dashed"
              style={{ borderColor: theme.border }}
            >
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: theme.surface }}
              >
                <Ionicons
                  name="receipt-outline"
                  size={32}
                  color={theme.gray300}
                />
              </View>
              <Text
                style={{ color: theme.text }}
                className="text-base font-bold"
              >
                No Transactions Yet
              </Text>
              <Text
                style={{ color: theme.gray400 }}
                className="text-xs text-center px-10 mt-1"
              >
                Start saving to see your history here.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isGoalModalVisible}
        onRequestClose={() => setIsGoalModalVisible(false)}
      >
        <AddGoalModal
          onAdd={async (data) => {
            const success = await addGoal(data);
            if (success) setIsGoalModalVisible(false);
          }}
          onClose={() => setIsGoalModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}
