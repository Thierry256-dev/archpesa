import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TransactionItem({ item }) {
  const { theme } = useTheme();

  const getTransactionStyles = (item) => {
    if (item.type === "credit") {
      return {
        icon: "arrow-up-circle",
        iconColor: theme.emerald,
        bgColor: theme.emerald + "15",
        amountPrefix: "+",
        amountColor: theme.emerald,
      };
    }

    switch (item.category) {
      case "loan":
        return {
          icon: "arrow-down-circle",
          iconColor: theme.gray600,
          bgColor: theme.gray100,
          amountPrefix: "-",
          amountColor: theme.text,
        };
      case "welfare":
        return {
          icon: "gift-outline",
          iconColor: theme.purple,
          bgColor: theme.purple + "15",
          amountPrefix: "-",
          amountColor: theme.gray600,
        };
      default:
        return {
          icon: "cash-outline",
          iconColor: theme.gray500,
          bgColor: theme.gray100,
          amountPrefix: "-",
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

      <View className="flex-1 ml-4">
        <Text style={{ color: theme.text }} className="text-[13px] font-bold">
          {item.title}
        </Text>
        <Text
          style={{ color: theme.gray400 }}
          className="text-xs font-medium mt-0.5"
        >
          {item.date}
        </Text>
      </View>

      <View className="items-end">
        <Text
          style={{ color: styles.amountColor }}
          className="text-[13px] font-black"
        >
          {styles.amountPrefix} UGX {item.amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}
