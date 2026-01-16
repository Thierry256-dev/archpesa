import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddGoalModal from "../../../components/ui/AddGoalModal";
import {
  ChartBar,
  CurrentGoal,
  GoalTemplate,
  TransactionRow,
} from "../../../components/ui/savingsSmallComponents";
import {
  chartData,
  savingGoals as initialGoals,
  popularGoals,
  savingsTransactions,
} from "../../../constants/data";

export default function MemberSavings() {
  const router = useRouter();
  const [goals, setGoals] = useState(initialGoals);
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);

  const addNewGoal = (newGoal) => {
    setGoals((prevGoals) => [newGoal, ...prevGoals]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-10">
      {/* BACKGROUND HEADER */}
      <View className="absolute top-0 w-full h-64 bg-arch-blue rounded-b-[40px]" />

      {/* HEADER & NAV */}
      <View className="px-6 pt-4 pb-2 flex-row gap-6 items-center">
        <Pressable
          onPress={() => router.back()}
          className="bg-white/20 p-2 rounded-xl"
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Text className="text-white text-center text-lg font-bold">
          My Savings
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* MAIN CONTENT LAYER */}
        <View className="bg-gray-50 rounded-t-[30px] px-6 pt-1 pb-10">
          {/* 1. SAVINGS CATEGORIES (Horizontal Scroll) */}
          <Text className="text-gray-800 text-lg font-bold mb-4">Accounts</Text>
          <View className="mb-8 -mx-6 px-6">
            {/* Ordinary Savings Card */}
            <View className="bg-arch-blue p-5 rounded-3xl w-full shadow-lg shadow-blue-900/20 mr-4">
              <View className="flex-row justify-between items-start mb-6">
                <View className="bg-white/20 p-2 rounded-full">
                  <Ionicons name="wallet-outline" size={24} color="#FFF" />
                </View>
                <View className="items-end">
                  <Text className="text-blue-200 text-[10px] tracking-wide">
                    LOAN POWER
                  </Text>
                  <Text className="text-white font-bold text-lg">
                    x3 Multiplier
                  </Text>
                </View>
              </View>
              <Text className="text-blue-200 text-sm font-medium">
                Ordinary Savings
              </Text>
              <Text className="text-white text-2xl font-bold mb-1">
                UGX 3,450,000
              </Text>
              <Text className="text-xs text-blue-100 font-semibold bg-white/10 self-start px-2 py-1 rounded">
                Liquid Cash
              </Text>
            </View>
            {/* Share Capital Card */}
            <View className="bg-white p-5 rounded-3xl w-full shadow-sm mr-4 mt-4 border-t-4 border-amber-400">
              <View className="flex-row justify-between items-start mb-6">
                <View className="bg-amber-100 p-2 rounded-full">
                  <Ionicons name="ribbon-outline" size={24} color="#D97706" />
                </View>
                <View className="items-end">
                  <Text className="text-gray-400 text-xs font-bold">
                    SHARES OWNED
                  </Text>
                  <Text className="text-gray-800 font-bold text-lg">500</Text>
                </View>
              </View>
              <Text className="text-gray-500 text-sm font-medium">
                Share Capital
              </Text>
              <Text className="text-gray-900 text-2xl font-bold mb-1">
                UGX 5,000,000
              </Text>
              <Text className="text-xs text-amber-600 font-semibold bg-amber-50 self-start px-2 py-1 rounded">
                🔒 Non-Withdrawable
              </Text>
            </View>
          </View>

          {/* 3. SAVINGS GOAL */}
          <View className="mb-8">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              Current Goal(s)
            </Text>
            <View>
              {goals?.map((item, index) => (
                <CurrentGoal key={index} {...item} />
              ))}
            </View>
          </View>

          {/* ADD NEW GOAL ACTION CARD */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-800 text-lg font-bold">
                Start a New Goal
              </Text>
            </View>

            <Pressable
              className="bg-white border-2 border-dashed border-gray-200 p-6 rounded-3xl items-center justify-center"
              onPress={() => {
                setIsGoalModalVisible(true);
              }}
            >
              <View className="bg-purple-50 p-4 rounded-full mb-3">
                <Ionicons name="add" size={32} color="#7C3AED" />
              </View>
              <Text className="text-gray-800 font-bold text-base">
                Create a Savings Goal
              </Text>
              <Text className="text-gray-400 text-xs text-center mt-1 px-6">
                Set a target and we&apos;ll help you track how close you are to
                your dream.
              </Text>
            </Pressable>
          </View>

          {/* GOAL TEMPLATES */}
          <View className="mb-10">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
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
          <View className="bg-white p-6 rounded-3xl shadow-sm mb-8 border border-slate-50">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-slate-800 font-black text-base">
                Growth History
              </Text>

              <View className="flex-row bg-slate-100 rounded-2xl p-2">
                <Text className="text-xs text-arch-blue px-2">Latest</Text>
                <Text className="text-xs text-arch-teal font-bold">2.5M</Text>
              </View>
            </View>

            {/* CHART AREA */}
            <View
              className="flex-row justify-between items-end w-full px-2"
              style={{ height: 180, zIndex: 10 }}
            >
              {chartData?.map((item, index) => (
                <ChartBar key={index} {...item} />
              ))}
            </View>
          </View>

          {/* 4. RECENT DEPOSITS */}
          <View>
            <Text className="text-gray-800 text-lg font-bold mb-4">
              History
            </Text>
            {savingsTransactions?.map((item, index) => (
              <TransactionRow key={index} {...item} />
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
          onAdd={addNewGoal}
          onClose={() => setIsGoalModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}
