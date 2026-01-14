import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function AlertCard({
  icon,
  iconColor,
  bgColor,
  title,
  subtitle,
  status,
  amount,
  action,
}) {
  return (
    <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className={`${bgColor} w-10 h-10 rounded-full items-center justify-center mr-3`}
          >
            <Ionicons name={icon} size={22} color={iconColor} />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-800">{title}</Text>
            <Text
              className={`text-sm ${
                status === "overdue"
                  ? "text-red-600"
                  : status === "pending"
                    ? "text-blue-600"
                    : "text-amber-600"
              }`}
            >
              {subtitle}
            </Text>
          </View>
        </View>

        <View className="items-end">
          {amount ? (
            <Text className="font-bold text-gray-800 text-sm mb-2">
              {amount}
            </Text>
          ) : null}
          <Pressable className="bg-gray-100 px-3 py-1.5 rounded-lg">
            <Text className="text-sm font-semibold text-arch-blue">
              {action}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
