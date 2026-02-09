import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

export default function TransactionItem({ item }) {
  const { theme } = useTheme();

  const getTransactionStyles = (item) => {
    switch (item.transaction_type) {
      case "Savings_Deposit":
        return {
          icon: "arrow-down-circle",
          iconColor: theme.emerald,
          bgColor: theme.emerald + "15",
          amountPrefix: "+",
          amountColor: theme.emerald,
        };
      case "Loan_Disbursement":
        return {
          icon: "briefcase-outline",
          iconColor: theme.emerald,
          bgColor: theme.emerald + "15",
          amountPrefix: "+",
          amountColor: theme.emerald,
        };
      case "Interest_Posting":
        return {
          icon: "trending-up",
          iconColor: theme.emerald,
          bgColor: theme.emerald + "15",
          amountPrefix: "+",
          amountColor: theme.emerald,
        };

      case "Savings_Withdraw":
        return {
          icon: "arrow-up-circle",
          iconColor: theme.rose,
          bgColor: theme.rose + "15",
          amountPrefix: "-",
          amountColor: theme.rose,
        };
      case "Loan_Repayment":
        return {
          icon: "checkbox-outline",
          iconColor: theme.blue,
          bgColor: theme.blue + "15",
          amountPrefix: "-",
          amountColor: theme.text,
        };

      case "Share_Purchase":
        return {
          icon: "ribbon-outline",
          iconColor: theme.purple,
          bgColor: theme.purple + "15",
          amountPrefix: "-",
          amountColor: theme.text,
        };

      case "Penalty":
        return {
          icon: "alert-circle-outline",
          iconColor: theme.rose,
          bgColor: theme.rose + "15",
          amountPrefix: "-",
          amountColor: theme.rose,
        };
      case "Fee":
        return {
          icon: "receipt-outline",
          iconColor: theme.gray500,
          bgColor: theme.gray100,
          amountPrefix: "-",
          amountColor: theme.gray600,
        };

      default:
        return {
          icon: "cash-outline",
          iconColor: theme.gray500,
          bgColor: theme.gray100,
          amountPrefix: item.direction === "Credit" ? "+" : "-",
          amountColor: theme.text,
        };
    }
  };
  const styles = getTransactionStyles(item);

  return (
    <View
      style={{
        borderBottomColor: theme.border,
      }}
      className="flex-row items-center py-2 border-b last:border-b-0"
    >
      <View
        style={{ backgroundColor: styles.bgColor }}
        className="w-12 h-12 rounded-2xl items-center justify-center"
      >
        <Ionicons name={styles.icon} size={20} color={styles.iconColor} />
      </View>

      <View className="flex-1">
        <View className="ml-4">
          <Text
            style={{ color: theme.text }}
            className="text-[13px] font-bold"
            numberOfLines={1}
          >
            {String(item.transaction_type).replace("_", " ") || item.notes}
          </Text>

          <View className="flex-row items-center justify-between mt-0.5">
            <Text
              style={{ color: theme.gray400 }}
              className="text-xs font-medium"
            >
              {formatTimeAgo(item.created_at)}
            </Text>
            <Text
              style={{ color: styles.amountColor }}
              className="text-[13px] font-black"
            >
              {styles.amountPrefix}
              {item.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
