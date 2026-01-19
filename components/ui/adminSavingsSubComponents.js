import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function TransactionRow({ tx, formatMoney }) {
  return (
    <View className="bg-white p-4 rounded-2xl mb-3 border border-slate-100 shadow-sm flex-row items-center">
      {/* Icon Box */}
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          tx.type === "deposit" ? "bg-emerald-50" : "bg-rose-50"
        }`}
      >
        <Ionicons
          name={tx.type === "deposit" ? "arrow-down" : "arrow-up"}
          size={18}
          color={tx.type === "deposit" ? "#059669" : "#e11d48"}
        />
      </View>

      {/* Details */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-bold text-slate-800 text-sm">
            {tx.reference}
          </Text>
          <Text
            className={`font-bold text-sm ${
              tx.type === "deposit" ? "text-emerald-600" : "text-slate-900"
            }`}
          >
            {tx.type === "deposit" ? "+" : "-"}
            {formatMoney(tx.amount)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-slate-400 font-medium">
            {tx.date} • <Text className="text-slate-300">ID: {tx.id}</Text>
          </Text>
          {/* Status Badge */}
          <View
            className={`px-2 py-0.5 rounded-md ${tx.status === "Verified" ? "bg-blue-50" : "bg-amber-50"}`}
          >
            <Text
              className={`text-[9px] font-bold ${tx.status === "Verified" ? "text-blue-600" : "text-amber-600"}`}
            >
              {tx.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
