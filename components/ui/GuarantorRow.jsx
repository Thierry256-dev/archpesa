import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function GuarantorRow({ name, status, amount, isLast }) {
  const isApproved = status === "Approved";
  return (
    <View
      className={`flex-row justify-between items-center py-3 ${!isLast ? "border-b border-gray-50" : ""}`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${isApproved ? "bg-emerald-100" : "bg-orange-100"}`}
        >
          <Ionicons
            name={isApproved ? "checkmark" : "time-outline"}
            size={16}
            color={isApproved ? "#10B981" : "#F59E0B"}
          />
        </View>
        <View className="ml-3">
          <Text className="font-bold text-slate-800 text-sm">{name}</Text>
          <Text className="text-gray-400 text-[10px]">{amount} guaranteed</Text>
        </View>
      </View>
      <Text
        className={`text-xs font-bold ${isApproved ? "text-emerald-600" : "text-orange-500"}`}
      >
        {status}
      </Text>
    </View>
  );
}
