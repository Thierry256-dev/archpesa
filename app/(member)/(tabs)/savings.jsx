import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddGoalModal from "../../../components/ui/AddGoalModal";
import TransactionItem from "../../../components/ui/TransactionItem";
import {
  ChartBar,
  CurrentGoal,
  GoalTemplate,
} from "../../../components/ui/savingsSmallComponents";
import { popularGoals } from "../../../constants/data";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";
import { useGrowthData } from "../../../hooks/useMemberGrowthData";
import { useSavingsGoals } from "../../../hooks/useSavingsGoals";

export default function MemberSavings() {
  const router = useRouter();
  const { theme } = useTheme();

  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);

  const { balances, transactions } = useMemberAllInfo();
  const savingsTransactions = transactions?.filter((tx) =>
    ["Savings_Deposit", "Savings_Withdraw"].includes(tx.transaction_type),
  );
  const sortedTx = [...savingsTransactions].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
  const { goals, loading: goalsLoading, addGoal } = useSavingsGoals();

  const calculateGoalProgress = (goalTarget) => {
    if (!goals || goals.length === 0) return { saved: 0, percent: 0 };

    const totalTargetSum = goals.reduce(
      (sum, g) => sum + Number(g.target_amount),
      0,
    );

    const currentSavings = Number(
      String(balances.Savings || "0").replace(/,/g, ""),
    );

    if (totalTargetSum === 0) return { saved: 0, percent: 0 };

    const fundedRatio = Math.min(currentSavings / totalTargetSum, 1);

    const allocatedAmount = goalTarget * fundedRatio;
    const percent = Math.round(fundedRatio * 100);

    return {
      saved: allocatedAmount,
      percent: percent,
    };
  };

  const growthData = useGrowthData(transactions);

  const chartData = growthData.map((item) => ({
    value: item.closingBalance,
    label: item.month,
    dataPointText: item.closingBalance.toLocaleString(),
  }));
  const maxValue = Math.max(...chartData.map((d) => d.value), 0);

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background }}
      className="flex-1 pb-10"
    >
      {/* BACKGROUND HEADER */}
      <View
        style={{ backgroundColor: theme.primary }}
        className="absolute top-0 w-full h-64 rounded-b-[40px]"
      />

      {/* HEADER & NAV */}
      <View className="px-6 pt-4 pb-2 flex-row gap-6 items-center">
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* MAIN CONTENT LAYER */}
        <View
          style={{ backgroundColor: theme.background }}
          className="rounded-t-[30px] px-6 pt-1 pb-10"
        >
          {/* 1. SAVINGS CATEGORIES  */}
          <Text
            style={{ color: theme.text }}
            className="text-lg font-bold mb-4"
          >
            Accounts
          </Text>
          <View className="mb-8 -mx-6 px-6">
            {/* Ordinary Savings Card */}
            <View
              style={{
                backgroundColor: theme.primary,
                shadowColor: theme.primary,
              }}
              className="p-5 rounded-3xl w-full shadow-lg mr-4"
            >
              <View className="flex-row justify-between items-start mb-6">
                <View className="bg-white/20 p-2 rounded-full">
                  <Ionicons
                    name="wallet-outline"
                    size={24}
                    color={theme.white}
                  />
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
                    x3 Multiplier
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
                UGX {balances.Savings.toLocaleString()}
              </Text>
              <Text
                style={{ color: theme.gray200 }}
                className="text-xs font-semibold bg-white/10 self-start px-2 py-1 rounded"
              >
                Liquid Cash
              </Text>
            </View>
            {/* Share Capital Card */}
            <View
              style={{
                backgroundColor: theme.card,
                borderTopColor: theme.yellow,
              }}
              className="p-5 rounded-3xl w-full shadow-sm mr-4 mt-4 border-t-4"
            >
              <View className="flex-row justify-between items-start mb-6">
                <View className="bg-amber-100 p-2 rounded-full">
                  <Ionicons
                    name="ribbon-outline"
                    size={24}
                    color={theme.yellow}
                  />
                </View>
                <View className="items-end">
                  <Text
                    style={{ color: theme.gray400 }}
                    className="text-xs font-bold"
                  >
                    SHARES OWNED
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between">
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
                    UGX {balances.Fixed_Deposit.toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ color: theme.gray500 }}
                    className="text-sm font-medium"
                  >
                    Share Capital
                  </Text>
                  <Text
                    style={{ color: theme.text }}
                    className="text-2xl font-bold mb-1"
                  >
                    UGX {balances.Shares.toLocaleString()}
                  </Text>
                </View>
              </View>
              <Text
                style={{ color: theme.yellow }}
                className="text-xs font-semibold bg-amber-50 self-start px-2 py-1 rounded"
              >
                🔒 Non-Withdrawable
              </Text>
            </View>
          </View>

          {/* 3. SAVINGS GOAL */}
          <View className="mb-8">
            <Text
              style={{ color: theme.text }}
              className="text-lg font-bold mb-4"
            >
              Current Goal(s)
            </Text>
            <View>
              {goalsLoading ? (
                <ActivityIndicator color={theme.primary} />
              ) : !goals || goals.length === 0 ? (
                <View
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.card, // Using card color instead of plain gray
                    borderStyle: "dashed",
                    borderWidth: 2,
                  }}
                  className="p-10 rounded-[32px] items-center justify-center mt-4"
                >
                  {/* Icon with soft background circle */}
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

                  {/* Text Content */}
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
                    You have not set any savings goals yet. Create one to start
                    tracking your journey towards your dreams.
                  </Text>

                  {/* Inline Action Button */}
                  <Pressable
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
                    const stats = calculateGoalProgress(item.target_amount);

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
                </View>
              )}
            </View>
          </View>

          {/* ADD NEW GOAL ACTION CARD */}
          {goals?.length > 0 && (
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  style={{ color: theme.text }}
                  className="text-lg font-bold"
                >
                  Start a New Goal
                </Text>
              </View>

              <Pressable
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
                className="border-2 border-dashed p-6 rounded-3xl items-center justify-center"
                onPress={() => {
                  setIsGoalModalVisible(true);
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
                  Create a Savings Goal
                </Text>
                <Text
                  style={{ color: theme.gray400 }}
                  className="text-xs text-center mt-1 px-6"
                >
                  Set a target and we&apos;ll help you track how close you are
                  to your dream.
                </Text>
              </Pressable>
            </View>
          )}
          {/* GOAL TEMPLATES */}
          <View className="mb-10">
            <Text
              style={{ color: theme.gray400 }}
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
            >
              Popular Goals
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-6 px-6"
            >
              {popularGoals?.map((item, index) => (
                <GoalTemplate key={index} {...item} />
              ))}
            </ScrollView>
          </View>

          {/* 2. GROWTH CHART */}
          <View
            style={{
              backgroundColor: theme.card,
              borderColor: theme.border,
            }}
            className="p-6 rounded-3xl shadow-sm mb-8 border"
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text
                style={{ color: theme.text }}
                className="font-black text-base"
              >
                Growth History
              </Text>

              <View
                style={{ backgroundColor: theme.gray100 }}
                className="flex-row rounded-2xl p-2"
              >
                <Text style={{ color: theme.primary }} className="text-xs px-2">
                  Maximum
                </Text>
                <Text
                  style={{ color: theme.archTeal }}
                  className="text-xs font-bold"
                >
                  {maxValue}
                </Text>
              </View>
            </View>

            {/* CHART AREA */}
            <View
              className="flex-row justify-between items-end w-full px-2"
              style={{ height: 180, zIndex: 10 }}
            >
              {chartData?.map((item, index) => (
                <ChartBar
                  key={index}
                  label={item.label}
                  value={item.value}
                  dataPointText={item.dataPointText}
                  maxValue={maxValue}
                />
              ))}
            </View>
          </View>

          {/* 4. RECENT DEPOSITS */}
          <View>
            <Text
              style={{ color: theme.text }}
              className="text-lg font-bold mb-4"
            >
              History
            </Text>
            {sortedTx?.map((item, index) => (
              <TransactionItem key={index} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
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
