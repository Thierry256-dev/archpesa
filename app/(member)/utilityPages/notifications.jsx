import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="px-6 py-4 border-b border-slate-50 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="#07193f" />
          </Pressable>
          <Text className="text-xl font-black text-slate-900 ml-2">
            Notifications
          </Text>
        </View>
        <Pressable>
          <Text className="text-blue-600 font-bold text-xs">
            Mark all as read
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <NotificationItem
          type="loan"
          title="Loan Approved! 🎉"
          desc="Your Emergency Loan of UGX 500k has been approved by the President."
          time="2 mins ago"
          isUnread
        />
        <NotificationItem
          type="savings"
          title="Deposit Confirmed"
          desc="Your monthly savings contribution of UGX 50,000 has been received."
          time="1 hour ago"
          isUnread
        />
        <NotificationItem
          type="alert"
          title="Payment Reminder"
          desc="Your loan installment of UGX 120,000 is due in 3 days."
          time="Yesterday"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationItem({ type, title, desc, time, isUnread }) {
  const getIcon = () => {
    if (type === "loan")
      return { name: "cash-outline", color: "#2563eb", bg: "bg-blue-50" };
    if (type === "savings")
      return { name: "wallet-outline", color: "#059669", bg: "bg-emerald-50" };
    return { name: "alert-circle-outline", color: "#e11d48", bg: "bg-rose-50" };
  };

  const icon = getIcon();

  return (
    <Pressable
      className={`flex-row p-6 border-b border-slate-50 ${isUnread ? "bg-blue-50/30" : ""}`}
    >
      <View
        className={`${icon.bg} w-12 h-12 rounded-2xl items-center justify-center`}
      >
        <Ionicons name={icon.name} size={24} color={icon.color} />
      </View>
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-start">
          <Text
            className={`text-sm ${isUnread ? "font-black text-slate-900" : "font-bold text-slate-700"}`}
          >
            {title}
          </Text>
          {isUnread && (
            <View className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
          )}
        </View>
        <Text className="text-slate-500 text-xs mt-1 leading-4">{desc}</Text>
        <Text className="text-slate-400 text-[10px] mt-2 font-medium">
          {time}
        </Text>
      </View>
    </Pressable>
  );
}
