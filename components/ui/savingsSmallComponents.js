import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export function ChartBar({ label, height, active }) {
  const rawHeight = height || 0;
  const barHeight = height ? height * 4 : rawHeight;
  const isActive = active;
  return (
    <Pressable className="items-center w-8 h-full justify-end">
      {isActive && (
        <View className="bg-gray-800 px-2 pt-4 rounded mb-2 shadow-sm">
          {/* Tiny Arrow */}
          <View className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rotate-45" />
        </View>
      )}
      <View
        className={`w-3`}
        style={{
          height: barHeight,
          backgroundColor: isActive ? "#07193f" : "#e2e8f0",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      />
      <Text className="text-[10px] text-gray-400 mt-2 font-medium">
        {label}
      </Text>
    </Pressable>
  );
}

export function TransactionRow({ date, type, amount }) {
  return (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-row items-center">
        <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3">
          <Ionicons name="arrow-up" size={18} color="#374151" />
        </View>
        <View>
          <Text className="text-gray-800 font-semibold text-sm">{type}</Text>
          <Text className="text-gray-400 text-xs">{date}</Text>
        </View>
      </View>
      <Text className="text-emerald-600 font-bold">{amount}</Text>
    </View>
  );
}

export function GoalTemplate({ icon, label, color, iconColor }) {
  return (
    <Pressable
      className={`${color} px-4 py-3 rounded-2xl mr-3 flex-row items-center border border-black/5`}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text className="ml-2 font-bold text-gray-700">{label}</Text>
    </Pressable>
  );
}
export function CurrentGoal({ icon, title, target, completed, remaining }) {
  return (
    <View className="bg-white p-5 rounded-2xl border border-gray-100">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View className="bg-purple-100 p-2 rounded-lg mr-3">
            <Ionicons name={icon} size={20} color="#7C3AED" />
          </View>
          <View>
            <Text className="font-bold text-gray-800">{title}</Text>
            <Text className="text-xs text-gray-500">Target: UGX {target}M</Text>
          </View>
        </View>
        <Text className="text-purple-500 font-bold">{completed}%</Text>
      </View>
      {/* Progress Bar */}
      <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <View
          style={{
            width: `${completed}%`,
          }}
          className={`h-full bg-purple-500 rounded-full`}
        />
      </View>
      <Text className="text-xs text-gray-400 mt-2">
        <Text className="text-gray-800 font-bold">UGX {remaining}M</Text>{" "}
        remaining to reach target.
      </Text>
    </View>
  );
}
