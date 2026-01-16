import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddGoalModal from "../../../components/ui/AddGoalModal";

export default function MemberSavings() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);

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

          {/* 2. GROWTH CHART (Custom CSS Bar Chart) */}
          <View className="bg-white p-6 rounded-3xl shadow-sm mb-8">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-gray-800 font-bold text-base">
                Growth History
              </Text>
              <View className="flex-row bg-gray-100 rounded-lg p-1">
                {["3M", "6M", "1Y"].map((period) => (
                  <Pressable
                    key={period}
                    onPress={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-md ${selectedPeriod === period ? "bg-white shadow-sm" : ""}`}
                  >
                    <Text
                      className={`text-xs font-bold ${selectedPeriod === period ? "text-arch-blue" : "text-gray-400"}`}
                    >
                      {period}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row justify-between items-end h-32 w-full px-2">
              <ChartBar label="May" height="h-12" color="bg-gray-200" />
              <ChartBar label="Jun" height="h-16" color="bg-gray-200" />
              <ChartBar label="Jul" height="h-14" color="bg-gray-200" />
              <ChartBar label="Aug" height="h-24" color="bg-blue-300" />
              <ChartBar label="Sep" height="h-20" color="bg-gray-200" />
              <ChartBar label="Oct" height="h-28" color="bg-arch-blue" active />
            </View>
          </View>

          {/* 3. SAVINGS GOAL */}
          <View className="mb-8">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              Current Goal
            </Text>
            <View className="bg-white p-5 rounded-2xl border border-gray-100">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Ionicons name="home-outline" size={20} color="#7C3AED" />
                  </View>
                  <View>
                    <Text className="font-bold text-gray-800">
                      Land Purchase
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Target: UGX 10M
                    </Text>
                  </View>
                </View>
                <Text className="text-purple-500 font-bold">84%</Text>
              </View>
              {/* Progress Bar */}
              <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <View className="h-full w-[84%] bg-purple-500 rounded-full" />
              </View>
              <Text className="text-xs text-gray-400 mt-2">
                <Text className="text-gray-800 font-bold">UGX 1.6M</Text>{" "}
                remaining to reach target.
              </Text>
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
              <GoalTemplate
                icon="school-outline"
                label="Education"
                color="bg-blue-50"
                iconColor="#2563EB"
              />
              <GoalTemplate
                icon="car-outline"
                label="Vehicle"
                color="bg-orange-50"
                iconColor="#EA580C"
              />
              <GoalTemplate
                icon="business-outline"
                label="Business"
                color="bg-emerald-50"
                iconColor="#059669"
              />
              <GoalTemplate
                icon="medkit-outline"
                label="Emergency"
                color="bg-red-50"
                iconColor="#DC2626"
              />
            </ScrollView>
          </View>

          {/* 4. RECENT DEPOSITS */}
          <View>
            <Text className="text-gray-800 text-lg font-bold mb-4">
              History
            </Text>
            <TransactionRow
              date="Oct 24"
              type="Mobile Money"
              amount="+ 50,000"
            />
            <TransactionRow
              date="Oct 01"
              type="Standing Order"
              amount="+ 150,000"
            />
            <TransactionRow
              date="Sep 24"
              type="Counter Deposit"
              amount="+ 200,000"
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGoalModalVisible}
        onRequestClose={() => setIsGoalModalVisible(false)}
      >
        <AddGoalModal onClose={() => setIsGoalModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}

/* --- SUB COMPONENTS --- */

function ChartBar({ label, height, color, active }) {
  return (
    <View className="items-center w-8">
      {active && (
        <View className="bg-gray-800 px-2 py-1 rounded mb-2 shadow-sm">
          <Text className="text-[10px] text-white font-bold">2.5M</Text>
          {/* Tiny Arrow */}
          <View className="absolute -bottom-1 left-3 w-2 h-2 bg-gray-800 rotate-45" />
        </View>
      )}
      <View className={`w-3 rounded-t-full ${height} ${color}`} />
      <Text className="text-[10px] text-gray-400 mt-2 font-medium">
        {label}
      </Text>
    </View>
  );
}

function TransactionRow({ date, type, amount }) {
  return (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-row items-center">
        <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3">
          <Ionicons name="arrow-up" size={18} color="#374151" />
        </View>
        <View>
          <Text className="text-gray-800 font-semibold text-sm">{type}</Text>
          <Text className="text-gray-400 text-xs">{date}</Text>
        </View>
      </View>
      <Text className="text-emerald-600 font-bold">{amount}</Text>
    </View>
  );
}

function GoalTemplate({ icon, label, color, iconColor }) {
  return (
    <Pressable
      className={`${color} px-4 py-3 rounded-2xl mr-3 flex-row items-center border border-black/5`}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text className="ml-2 font-bold text-gray-700">{label}</Text>
    </Pressable>
  );
}
