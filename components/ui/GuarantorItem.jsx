import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function GuarantorItem({
  name,
  loanType,
  amount,
  status,
  date,
  isWarning,
}) {
  return (
    <View className="bg-white p-5 rounded-3xl border border-slate-100 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center">
            <Ionicons name="person-outline" size={20} color="#07193f" />
          </View>
          <View className="ml-3">
            <Text className="font-bold text-slate-900">{name}</Text>
            <Text className="text-slate-400 text-[10px]">{loanType}</Text>
          </View>
        </View>
        <View
          className={`${isWarning ? "bg-red-50" : "bg-emerald-50"} px-3 py-1 rounded-full`}
        >
          <Text
            className={`text-[10px] font-bold ${isWarning ? "text-red-600" : "text-[#10b981]"}`}
          >
            {status}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-slate-50 w-full mb-4" />

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-slate-400 text-[10px] uppercase font-bold">
            Pledged Amount
          </Text>
          <Text className="text-[#07193f] font-bold">{amount}</Text>
        </View>
        <Text className="text-slate-400 text-[10px] font-medium">{date}</Text>
      </View>
    </View>
  );
}
