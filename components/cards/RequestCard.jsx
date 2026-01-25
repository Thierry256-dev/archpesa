import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function RequestCard({ data, onAccept, onReject }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
      className="p-5 rounded-3xl border mb-4 shadow-sm"
    >
      {/* 1. BORROWER IDENTITY */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View
            style={{ backgroundColor: theme.primary + "15" }}
            className="w-12 h-12 rounded-2xl items-center justify-center"
          >
            <Text style={{ color: theme.text }} className="text-lg font-bold">
              {data.sender.charAt(0)}
            </Text>
          </View>
          <View className="ml-3">
            <Text
              style={{ color: theme.text }}
              className="font-black text-base"
            >
              {data.sender}
            </Text>
            <Text
              style={{ color: theme.gray400 }}
              className="text-[10px] font-bold"
            >
              MEMBER ID: {data.memberId}
            </Text>
          </View>
        </View>
        <View
          style={{ backgroundColor: theme.gray100 }}
          className="px-2 py-1 rounded-md"
        >
          <Text
            style={{ color: theme.gray500 }}
            className="text-[9px] font-bold"
          >
            {data.date}
          </Text>
        </View>
      </View>

      {/* 2. THE FINANCIAL BREAKDOWN */}
      <View
        style={{
          backgroundColor: theme.gray50,
          borderColor: theme.border,
        }}
        className="rounded-2xl p-4 mb-4 border"
      >
        <View className="flex-row justify-between mb-3">
          <View>
            <Text
              style={{ color: theme.gray400 }}
              className="text-[10px] uppercase font-bold"
            >
              Total Loan
            </Text>
            <Text style={{ color: theme.text }} className="font-bold text-sm">
              {data.loanAmount}
            </Text>
          </View>
          <View className="items-end">
            <Text
              style={{ color: theme.primary }}
              className="text-[10px] uppercase font-bold"
            >
              Your Pledge
            </Text>
            <Text
              style={{ color: theme.primary }}
              className="font-black text-sm"
            >
              {data.pledgeAmount}
            </Text>
          </View>
        </View>

        <View
          style={{ backgroundColor: theme.gray200 }}
          className="h-[1px] w-full mb-3"
        />

        <Text
          style={{ color: theme.gray600 }}
          className="text-xs italic leading-4"
        >
          &quot;Purpose: {data.purpose}&quot;
        </Text>
      </View>

      {/* 3. RISK WARNING INDICATOR */}
      <View className="flex-row items-center mb-5 px-1">
        <Ionicons
          name="information-circle-outline"
          size={14}
          color={theme.gray400}
        />
        <Text
          style={{ color: theme.gray400 }}
          className="text-[10px] ml-2 flex-1"
        >
          Accepting will lock{" "}
          <Text style={{ color: theme.gray600 }} className="font-bold">
            {data.pledgeAmount}
          </Text>{" "}
          from your withdrawable savings.
        </Text>
      </View>

      {/* 4. ACTIONS */}
      <View className="flex-row gap-x-3">
        <Pressable
          onPress={onReject}
          style={{
            borderColor: theme.border,
          }}
          className="flex-1 py-4 rounded-2xl border items-center active:opacity-70"
        >
          <Text style={{ color: theme.gray600 }} className="font-bold text-xs">
            Decline
          </Text>
        </Pressable>
        <Pressable
          onPress={onAccept}
          style={{ backgroundColor: theme.primary, shadowColor: theme.primary }}
          className="flex-1 py-4 rounded-2xl items-center shadow-md"
        >
          <Text className="text-white font-bold text-xs">Accept & Pledge</Text>
        </Pressable>
      </View>
    </View>
  );
}
