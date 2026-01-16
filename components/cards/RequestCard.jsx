import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function RequestCard({ data, onAccept, onReject }) {
  return (
    <View className="bg-white p-5 rounded-3xl border border-slate-100 mb-4 shadow-sm">
      {/* 1. BORROWER IDENTITY */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center">
            <Text className="text-lg font-bold text-[#07193f]">
              {data.sender.charAt(0)}
            </Text>
          </View>
          <View className="ml-3">
            <Text className="font-black text-slate-900 text-base">
              {data.sender}
            </Text>
            <Text className="text-slate-400 text-[10px] font-bold">
              MEMBER ID: {data.memberId}
            </Text>
          </View>
        </View>
        <View className="bg-slate-100 px-2 py-1 rounded-md">
          <Text className="text-slate-500 text-[9px] font-bold">
            {data.date}
          </Text>
        </View>
      </View>

      {/* 2. THE FINANCIAL BREAKDOWN (The "Why" and "How Much") */}
      <View className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
        <View className="flex-row justify-between mb-3">
          <View>
            <Text className="text-slate-400 text-[10px] uppercase font-bold">
              Total Loan
            </Text>
            <Text className="text-slate-800 font-bold text-sm">
              {data.loanAmount}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-blue-600 text-[10px] uppercase font-bold">
              Your Pledge
            </Text>
            <Text className="text-blue-700 font-black text-sm">
              {data.pledgeAmount}
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-slate-200 w-full mb-3" />

        <Text className="text-slate-500 text-xs italic leading-4">
          &quot;Purpose: {data.purpose}&quot;
        </Text>
      </View>

      {/* 3. RISK WARNING INDICATOR */}
      <View className="flex-row items-center mb-5 px-1">
        <Ionicons name="information-circle-outline" size={14} color="#64748b" />
        <Text className="text-slate-400 text-[10px] ml-2 flex-1">
          Accepting will lock{" "}
          <Text className="font-bold text-slate-600">{data.pledgeAmount}</Text>{" "}
          from your withdrawable savings.
        </Text>
      </View>

      {/* 4. ACTIONS */}
      <View className="flex-row gap-x-3">
        <Pressable
          onPress={onReject}
          className="flex-1 py-4 rounded-2xl border border-slate-200 items-center"
        >
          <Text className="text-slate-600 font-bold text-xs">Decline</Text>
        </Pressable>
        <Pressable
          onPress={onAccept}
          className="flex-1 py-4 rounded-2xl bg-[#07193f] items-center shadow-md shadow-blue-900/20"
        >
          <Text className="text-white font-bold text-xs">Accept & Pledge</Text>
        </Pressable>
      </View>
    </View>
  );
}
