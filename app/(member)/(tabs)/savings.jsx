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
  const safeUserId = user?.id ?? null;

  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);

  const { data: application } = useMemberApplication(safeUserId);
  const { balances, transactions } = useMemberAllInfo();
  const { goals, loading: goalsLoading, addGoal } = useSavingsGoals();
  const growthData = useGrowthData(transactions);
  const [activeChartIndex, setActiveChartIndex] = useState(null);

  const safeBalances = balances || {
    Savings: 0,
    Shares: 0,
    Fixed_Deposit: 0,
  };

  const safeGoals = Array.isArray(goals) ? goals : [];

  const isApproved = application?.status === "approved";
  const sharePrice = 10000;

  // 1. Sort & Filter Transactions
  const savingsTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    const transactionsToProcess = Array.isArray(transactions)
      ? transactions
      : [];

    return transactionsToProcess
      .filter(
        (tx) =>
          tx &&
          ["Savings_Deposit", "Savings_Withdraw"].includes(tx.transaction_type),
      )
      .sort(
        (a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0),
      );
  }, [transactions]);

  // 2. Chart Data
  const { chartData, maxValue } = useMemo(() => {
    const dataToProcess = Array.isArray(growthData) ? growthData : [];

    if (!dataToProcess.length) return { chartData: [], maxValue: 0 };

    const data = dataToProcess.map((item) => {
      const value = Number(item?.closingBalance || 0);
      return {
        value,
        label: item?.month ?? "",
        dataPointText: value.toLocaleString(),
      };
    });

    const max = Math.max(...data.map((d) => d.value), 0);
    return { chartData: data, maxValue: max };
  }, [growthData]);

  // 3. Goal Progress Helper
  const getGoalProgress = useCallback(
    (goalTarget = 0) => {
      const currentGoals = Array.isArray(goals) ? goals : [];
      if (!currentGoals.length) return { saved: 0, percent: 0 };

      const totalTargetSum = currentGoals.reduce(
        (sum, g) => sum + Number(g?.target_amount || 0),
        0,
      );

      const rawSavings = balances?.Savings || 0;
      const currentSavings = Number(String(rawSavings).replace(/,/g, ""));

      if (!totalTargetSum || !currentSavings) return { saved: 0, percent: 0 };

      const fundedRatio = Math.min(currentSavings / totalTargetSum, 1);
      return {
        saved: Number(goalTarget || 0) * fundedRatio,
        percent: Math.round(fundedRatio * 100),
      };
    },
    [goals, balances],
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
            {formatCurrency(safeBalances?.Savings || 0)}
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
          <View className="flex-row justify-between items-start mb-2">
            <View className="">
              <View className="bg-amber-100 p-2 rounded-full w-14 items-center">
                <Ionicons
                  name="ribbon-outline"
                  size={24}
                  color={theme.yellow}
                />
              </View>
              <Text
                style={{ color: theme.yellow }}
                className="text-xs font-semibold bg-amber-50 self-start px-2 py-1 rounded mt-2"
              >
                🔒 Non-Withdrawable
              </Text>
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
                {Number(
                  (safeBalances?.Shares || 0) / sharePrice,
                ).toLocaleString()}
              </Text>
            </View>
          </View>
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
              onPress={() => {
                if (isApproved) {
                  setIsGoalModalVisible(true);
                } else {
                  alert(
                    "Feature will be available upon member application approval",
                  );
                }
              }}
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
            {safeGoals.map((item, index) => {
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
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
              className="mt-4 border-2 border-dashed p-6 rounded-3xl items-center justify-center"
              onPress={() => {
                if (isApproved) {
                  setIsGoalModalVisible(true);
                } else {
                  alert(
                    "Feature will be available upon member application approval",
                  );
                }
              }}
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

        {/* Chart Container */}
        <View
          className="flex-row justify-between items-end w-full px-2 mt-4"
          style={{ height: 180 }}
        >
          {chartData.length > 0 ? (
            chartData.map((item, index) => {
              const isSelected =
                activeChartIndex === null
                  ? index === chartData.length - 1
                  : activeChartIndex === index;

              return (
                <ChartBar
                  key={index}
                  label={item.label}
                  value={item.value}
                  dataPointText={item.dataPointText}
                  maxValue={maxValue}
                  isActive={isSelected}
                  onPress={() => setActiveChartIndex(index)}
                  style={{ width: `${100 / chartData.length}%` }}
                />
              );
            })
          ) : (
            <View className="flex-1 items-center justify-center h-full opacity-50">
              <View className="bg-gray-100 p-4 rounded-full mb-2">
                <Ionicons
                  name="bar-chart-outline"
                  size={32}
                  color={theme.gray400}
                />
              </View>
              <Text
                style={{ color: theme.gray400 }}
                className="text-xs font-medium text-center"
              >
                No activity yet
              </Text>
              <Text
                style={{ color: theme.gray300 }}
                className="text-[10px] text-center mt-1"
              >
                Data from Transactions of the last 6 months{"\n"}will appear
                here.
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

  const renderTransaction = useCallback(({ item }) => {
    if (!item) return null;

    return (
      <View className="px-6 pb-10">
        <TransactionItem item={item} />
      </View>
    );
  }, []);

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background }}
      className="flex-1"
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
          keyExtractor={(item, index) =>
            item?.id?.toString() ?? item?.created_at ?? `tx-${index}`
          }
          renderItem={renderTransaction}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View
              className="items-center justify-center py-10 mx-6 rounded-3xl border-2 border-dashed mb-16"
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
            try {
              if (!data) return;

              const success = await addGoal(data);

              if (success) {
                setIsGoalModalVisible(false);
              }
            } catch (err) {
              console.log("Add goal failed:", err);
              alert("Failed to save goal. Try again.");
            }
          }}
          onClose={() => setIsGoalModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}
