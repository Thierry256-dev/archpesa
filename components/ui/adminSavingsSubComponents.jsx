import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function TransactionRow({ tx, formatMoney }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.gray100,
      }}
      className="p-4 rounded-2xl mb-3 border shadow-sm flex-row items-center"
    >
      {/* Icon Box */}
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{
          backgroundColor:
            tx.type === "deposit" ? theme.surface : theme.surface,
        }}
      >
        <Ionicons
          name={tx.type === "deposit" ? "arrow-down" : "arrow-up"}
          size={18}
          color={tx.type === "deposit" ? theme.emerald : theme.rose}
        />
      </View>

      {/* Details */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text style={{ color: theme.gray800 }} className="font-bold text-sm">
            {tx.reference}
          </Text>
          <Text
            className="font-bold text-sm"
            style={{
              color: tx.type === "deposit" ? theme.emerald : theme.text,
            }}
          >
            {tx.type === "deposit" ? "+" : "-"}
            {formatMoney(tx.amount)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text
            style={{ color: theme.gray400 }}
            className="text-xs font-medium"
          >
            {tx.date} •{" "}
            <Text style={{ color: theme.gray300 }}>ID: {tx.id}</Text>
          </Text>
          {/* Status Badge */}
          <View
            style={{ backgroundColor: theme.gray50 }}
            className="px-2 py-0.5 rounded-md"
          >
            <Text
              className="text-[9px] font-bold"
              style={{
                color: tx.status === "Verified" ? theme.blue : theme.orange,
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
