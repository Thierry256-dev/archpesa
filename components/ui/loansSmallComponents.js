import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export function GuarantorStatusRow({ name, memberId, status, pledge, isLast }) {
  const getStatusStyle = () => {
    switch (status) {
      case "Accepted":
        return {
          text: "text-emerald-600",
          bg: "bg-emerald-50",
          icon: "checkmark-circle",
        };
      case "Rejected":
        return { text: "text-red-600", bg: "bg-red-50", icon: "close-circle" };
      default:
        return { text: "text-orange-600", bg: "bg-orange-50", icon: "time" };
    }
  };

  const style = getStatusStyle();

  return (
    <View
      className={`flex-row items-center py-3 ${!isLast ? "border-b border-slate-50" : ""}`}
    >
      {/* Avatar/Initial */}
      <View className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center">
        <Text className="font-bold text-slate-600">{name.charAt(0)}</Text>
      </View>

      <View className="flex-1 ml-3">
        <Text className="text-sm font-bold text-slate-800">{name}</Text>
        <Text className="text-[10px] text-slate-400 font-medium">
          ID: {memberId}
        </Text>
      </View>

      <View className="items-end">
        <View
          className={`${style.bg} px-2 py-1 rounded-md flex-row items-center mb-1`}
        >
          <Ionicons
            name={style.icon}
            size={12}
            color={style.text.replace("text-", "#")}
          />
          <Text
            className={`${style.text} text-[10px] font-black ml-1 uppercase`}
          >
            {status}
          </Text>
        </View>
        {status === "Accepted" && (
          <Text className="text-slate-500 font-bold text-[9px]">{pledge}</Text>
        )}
      </View>
    </View>
  );
}

export function ReplacementItem({ name, id, onSelect }) {
  return (
    <Pressable
      onPress={onSelect}
      className="flex-row items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl mb-3 shadow-sm active:bg-slate-50"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center">
          <Text className="text-indigo-600 font-bold">{name.charAt(0)}</Text>
        </View>
        <View className="ml-3">
          <Text className="text-slate-800 font-bold text-sm">{name}</Text>
          <Text className="text-slate-400 text-[10px]">Member ID: {id}</Text>
        </View>
      </View>
      <View className="bg-indigo-600 px-3 py-1.5 rounded-xl">
        <Text className="text-white font-bold text-[10px]">Select</Text>
      </View>
    </Pressable>
  );
}

export function TabButton({ label, name, activeTab, onPress }) {
  const isActive = activeTab === name;

  return (
    <Pressable
      hitSlop={8}
      onPress={(e) => {
        if (onPress) onPress();
      }}
      className="flex-1 py-3 rounded-xl items-center justify-center"
      style={{
        backgroundColor: isActive ? "#FFFFFF" : "transparent",
        shadowColor: isActive ? "#000" : "transparent",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.1 : 0,
        shadowRadius: 4,
        elevation: isActive ? 2 : 0,
      }}
    >
      <Text
        className={`font-bold ${
          isActive ? "text-[#07193f]" : "text-slate-400"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ApproverRow({ name, person, status, icon, isLast }) {
  return (
    <View
      className={`flex-row justify-between items-center py-4 ${!isLast ? "border-b border-gray-50" : ""}`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-2xl items-center justify-center ${status === "Approved" ? "bg-emerald-50" : "bg-slate-50"}`}
        >
          <Ionicons
            name={icon}
            size={20}
            color={status === "Approved" ? "#10B981" : "#94A3B8"}
          />
        </View>
        <View className="ml-3">
          <Text className="text-gray-400 text-[10px] font-bold uppercase">
            {name}
          </Text>
          <Text className="font-bold text-slate-800 text-sm">{person}</Text>
        </View>
      </View>
      <View
        className={`px-3 py-1 rounded-full ${status === "Approved" ? "bg-emerald-100" : "bg-orange-50"}`}
      >
        <Text
          className={`text-[10px] font-black ${status === "Approved" ? "text-emerald-700" : "text-orange-600"}`}
        >
          {status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

export function HistoryItem({ title, amount, date, status }) {
  return (
    <View className="bg-white mb-3 p-4 rounded-2xl flex-row justify-between items-center border border-gray-100">
      <View>
        <Text className="font-bold text-slate-800">{title}</Text>
        <Text className="text-gray-400 text-xs">{date}</Text>
      </View>
      <View className="items-end">
        <Text className="font-black text-slate-900">{amount}</Text>
        <View className="flex-row items-center">
          <Ionicons name="checkmark-done" size={14} color="#10B981" />
          <Text className="text-emerald-600 text-[10px] font-bold ml-1">
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function LoanActionCard({ title, icon, color, desc }) {
  return (
    <Pressable className="w-[48%] flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
      <View
        className={`${color} w-10 h-10 rounded-2xl items-center justify-center mb-3`}
      >
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <Text numberOfLines={1} className="font-bold text-slate-900 text-sm">
        {title}
      </Text>
      <Text className="text-gray-400 text-[10px] mt-1">{desc}</Text>
    </Pressable>
  );
}
