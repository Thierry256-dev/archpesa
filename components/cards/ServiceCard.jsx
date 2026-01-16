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
  return (
    <Pressable
      onPress={onPress}
      className={`w-[48%] ${bg} p-4 rounded-2xl border border-black/5 flex-row items-start`}
      style={{ elevation: 1 }}
    >
      <View className="bg-white/60 p-2 rounded-xl mr-3 shadow-sm">
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text
          className="text-slate-800 font-bold text-[13px]"
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>
          {subLabel}
        </Text>
      </View>
    </Pressable>
  );
}
