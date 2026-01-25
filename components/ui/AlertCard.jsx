import { useTheme } from "@/context/ThemeProvider";
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
  const { theme } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
      className="rounded-xl p-4 shadow-sm border"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className={`${bgColor} w-10 h-10 rounded-full items-center justify-center mr-3`}
          >
            <Ionicons name={icon} size={22} color={iconColor} />
          </View>
          <View className="flex-1">
            <Text style={{ color: theme.text }} className="font-bold">
              {title}
            </Text>
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
            <Text
              style={{ color: theme.text }}
              className="font-bold text-sm mb-2"
            >
              {amount}
            </Text>
          ) : null}
          <Pressable
            style={{ backgroundColor: theme.surface }}
            className="px-3 py-1.5 rounded-lg"
          >
            <Text
              style={{ color: theme.primary }}
              className="text-sm font-semibold"
            >
              {action}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
