import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TransactionItem({ item }) {
  const getTransactionStyles = (item) => {
    if (item.type === "credit") {
      return {
        icon: "arrow-up-circle",
        iconColor: "#10b981", // emerald-500
        bgColor: "bg-emerald-50",
        amountPrefix: "+",
        amountColor: "text-emerald-600",
      };
    }

    // Default/Debit styles based on category
    switch (item.category) {
      case "loan":
        return {
          icon: "arrow-down-circle",
          iconColor: "#475569",
          bgColor: "bg-slate-100",
          amountPrefix: "-",
          amountColor: "text-slate-800",
        };
      case "welfare":
        return {
          icon: "gift-outline",
          iconColor: "#a855f7",
          bgColor: "bg-purple-50",
          amountPrefix: "-",
          amountColor: "text-slate-600",
        };
      default:
        return {
          icon: "cash-outline",
          iconColor: "#64748b",
          bgColor: "bg-gray-100",
          amountPrefix: "-",
          amountColor: "text-gray-800",
        };
    }
  };
  const styles = getTransactionStyles(item);
  return (
    <View className="flex-row items-center py-2 border-b border-gray-50 last:border-b-0">
      <View
        className={`w-12 h-12 rounded-2xl ${styles.bgColor} items-center justify-center`}
      >
        <Ionicons name={styles.icon} size={20} color={styles.iconColor} />
      </View>

      {/* Info */}
      <View className="flex-1 ml-4">
        <Text className="text-[13px] font-bold text-slate-900">
          {item.title}
        </Text>
        <Text className="text-xs font-medium text-slate-400 mt-0.5">
          {item.date}
        </Text>
      </View>

      {/* Amount */}
      <View className="items-end">
        <Text className={`text-[13px] font-black ${styles.amountColor}`}>
          {styles.amountPrefix} UGX {item.amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}
