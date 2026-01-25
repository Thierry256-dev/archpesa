import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function ServiceCard({
  icon,
  label,
  subLabel,
  iconColor,
  bg,
  onPress,
}) {
  const { theme, mode } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className={`w-[48%] ${bg} p-4 rounded-2xl flex-row items-start border-2`}
      style={{
        borderColor: theme.border,
        backgroundColor: mode === "dark" ? theme.card : undefined,
      }}
    >
      <View
        style={{
          backgroundColor:
            theme.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.6)",
        }}
        className="p-2 rounded-xl mr-3 shadow-sm"
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text
          style={{ color: theme.text }}
          className="font-bold text-[13px]"
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text
          style={{ color: theme.gray500 }}
          className="text-xs mt-0.5"
          numberOfLines={1}
        >
          {subLabel}
        </Text>
      </View>
    </Pressable>
  );
}
