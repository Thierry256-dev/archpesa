import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

export const RequestCard = ({
  item,
  theme,
  getStatusColor,
  setSelectedRequest,
}) => {
  return (
    <Pressable
      onPress={() => setSelectedRequest(item)}
      style={{
        backgroundColor: theme.card,
        shadowColor: theme.gray300,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
      className="mx-6 mb-3 p-4 rounded-2xl flex-row items-center border border-slate-100"
    >
      {/* ICON BOX */}
      <View
        style={{ backgroundColor: getStatusColor(item.direction) + "15" }}
        className="w-12 h-12 rounded-xl items-center justify-center mr-4"
      >
        <Ionicons
          name={
            item.direction === "Credit"
              ? "wallet-outline"
              : item.direction === "Debit"
                ? "arrow-up-circle-outline"
                : "document-text-outline"
          }
          size={22}
          color={getStatusColor(item.direction)}
        />
      </View>

      {/* DETAILS */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text
            style={{ color: theme.gray900 }}
            className="font-bold text-base"
          >
            {item.userName}
          </Text>
          <Text
            style={{ color: getStatusColor(item.direction) }}
            className="font-bold text-sm"
          >
            {item.direction === "Debit" ? "-" : "+"}
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            style={{ color: theme.gray500 }}
            className="text-xs font-medium"
          >
            {String(item.payment_method).replace("_", " ")} •
            {formatTimeAgo(item.created_at)}
          </Text>
          {/* UNREAD DOT */}
          <View
            style={{ backgroundColor: theme.primary }}
            className="w-2 h-2 rounded-full"
          />
        </View>
      </View>
    </Pressable>
  );
};
