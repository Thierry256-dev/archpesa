import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TransactionItem({
  icon,
  iconColor,
  bg,
  title,
  date,
  amount,
  amountColor,
}) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-50 last:border-b-0">
      <View
        className={`w-10 h-10 ${bg} rounded-full items-center justify-center`}
      >
        <Ionicons name={icon} size={20} className={iconColor} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-semibold text-gray-800 text-sm">{title}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">{date}</Text>
      </View>
      <Text className={`font-bold text-sm ${amountColor}`}>{amount}</Text>
    </View>
  );
}
