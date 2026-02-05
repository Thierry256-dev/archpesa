import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import {
  creditTransactionTypes,
  debitTransactionTypes,
} from "../../../constants/admin/transactionTypes";
import { formatDateFull } from "../../../utils/formatDateFull";

export function TransactionRow({ tx, formatMoney }) {
  const { theme } = useTheme();

  const getIconConfig = (type) => {
    switch (type) {
      case "Savings_Deposit":
        return {
          name: "download-outline",
          color: theme.emerald,
          bg: "bg-emerald-50",
        };
      case "Savings_Withdraw":
        return { name: "exit-outline", color: theme.rose, bg: "bg-rose-50" };
      case "Share_Purchase":
        return {
          name: "pie-chart-outline",
          color: theme.emerald,
          bg: "bg-emerald-50",
        };
      case "Loan_Disbursement":
        return { name: "send-outline", color: theme.rose, bg: "bg-rose-50" };
      case "Loan_Repayment":
        return {
          name: "refresh-circle-outline",
          color: theme.emerald,
          bg: "bg-emerald-50",
        };
      case "Interest_Posting":
        return {
          name: "trending-up-outline",
          color: theme.emerald,
          bg: "bg-emerald-50",
        };
      case "Penalty":
        return {
          name: "alert-circle-outline",
          color: theme.rose,
          bg: "bg-rose-50",
        };
      case "Fee":
        return {
          name: "receipt-outline",
          color: theme.emerald,
          bg: "bg-emerald-50",
        };
      default:
        return {
          name: "swap-horizontal-outline",
          color: theme.gray500,
          bg: "bg-gray-50",
        };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return theme.emerald;
      case "Pending":
        return theme.orange;
      case "Failed":
        return theme.red;
      default:
        return theme.gray500;
    }
  };

  const iconConfig = getIconConfig(tx.transaction_type);

  return (
    <View className="p-4 rounded-2xl mb-3 border shadow-sm flex-row items-center bg-white border-slate-100">
      {/* Admin Icon Box */}
      <View
        className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${iconConfig.bg}`}
      >
        <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
      </View>

      {/* Details */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <View>
            <Text
              className="font-bold text-sm text-slate-800"
              numberOfLines={1}
            >
              {tx.transaction_type.replace("_", " ")}
            </Text>

            <Text className="text-[10px] text-slate-400 font-medium">
              {tx.userName}-{tx.membership_no}
            </Text>
          </View>

          <Text
            className="font-bold text-[15px]"
            style={{
              color: creditTransactionTypes.includes(tx.transaction_type)
                ? theme.emerald
                : theme.red,
            }}
          >
            {debitTransactionTypes.includes(tx.transaction_type) ? "-" : "+"}
            {formatMoney(tx.amount)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-[10px] font-medium text-slate-400">
            {formatDateFull(tx.created_at)}
            <Text className="text-slate-300">
              {" "}
              • REF: {String(tx.id).slice(0, 8).toUpperCase()}
            </Text>
          </Text>

          <View className="px-2 py-0.5">
            <Text
              style={{
                color: getStatusColor(tx.status),
                fontSize: 8,
                fontWeight: "900",
              }}
            >
              {tx.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function FilterTab({
  label,
  type,
  isActive,
  onPress,
  activeColor = "#0f172a",
}) {
  return (
    <Pressable
      onPress={() => onPress(type)}
      className={`px-4 py-1.5 mr-2 rounded-full items-center justify-center border transition-all ${
        isActive ? "border-transparent" : "bg-white border-slate-200"
      }`}
      style={isActive ? { backgroundColor: activeColor } : {}}
    >
      <Text
        className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-600"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export const ActionButton = ({ icon, label, color, onPress }) => {
  const styles = {
    red: { bg: "bg-rose-50", icon: "#e11d48", text: "text-rose-600" },
    green: { bg: "bg-emerald-50", icon: "#10b981", text: "text-emerald-600" },
  }[color] || { bg: "bg-slate-50", icon: "#64748b", text: "text-slate-600" };

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center w-28 py-2 active:opacity-70 rounded-xl active:bg-slate-50"
    >
      <View
        className={`${styles.bg} w-10 h-10 rounded-full items-center justify-center mb-2`}
      >
        <Ionicons name={icon} size={20} color={styles.icon} />
      </View>
      <Text className={`text-[11px] font-bold ${styles.text} text-center`}>
        {label}
      </Text>
    </Pressable>
  );
};
