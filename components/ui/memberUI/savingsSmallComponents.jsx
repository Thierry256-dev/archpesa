import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export function ChartBar({
  label = "",
  value = 0,
  dataPointText = "",
  maxValue = 100,
  style,
  onPress,
  isActive,
}) {
  const { theme } = useTheme();
  const MAX_BAR_HEIGHT = 150;
  const safeValue = Number(value) || 0;
  const safeMax = Number(maxValue) || 0;

  let calculatedHeight =
    safeMax > 0 ? (safeValue / safeMax) * MAX_BAR_HEIGHT : 0;
  const barHeight = Math.min(Math.max(calculatedHeight, 0), MAX_BAR_HEIGHT);

  const displayLabel = (label || "---").toString();
  const displayValue = dataPointText || safeValue.toLocaleString();

  return (
    <Pressable
      onPress={onPress}
      style={style}
      className="items-center h-full justify-end"
    >
      {/* Tooltip */}
      {isActive && (
        <View
          style={{
            backgroundColor: theme.gray800,
            bottom: barHeight + 10,
            zIndex: 50,
          }}
          className="px-2 py-1 rounded shadow-sm absolute items-center min-w-[40px]"
        >
          <Text className="text-white text-[10px] font-bold" numberOfLines={1}>
            {displayValue}
          </Text>
          <View
            style={{ backgroundColor: theme.gray800 }}
            className="absolute -bottom-1 w-2 h-2 rotate-45"
          />
        </View>
      )}

      {/* The Bar */}
      <View
        className="w-4 rounded-t-md"
        style={{
          height: barHeight,
          backgroundColor: isActive ? theme.primary : theme.gray200,
          opacity: isActive ? 1 : 0.6,
        }}
      />

      {/* The Label */}
      <Text
        style={{ color: theme.gray400 }}
        className="text-[10px] mt-2 font-bold uppercase text-center"
        numberOfLines={1}
      >
        {displayLabel.substring(0, 3)}
      </Text>
    </Pressable>
  );
}

export function TransactionRow({ date, type, amount }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        borderBottomColor: theme.border,
      }}
      className="flex-row items-center justify-between py-4 border-b"
    >
      <View className="flex-row items-center">
        <View
          style={{ backgroundColor: theme.gray100 }}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          <Ionicons name="arrow-up" size={18} color={theme.gray700} />
        </View>
        <View>
          <Text style={{ color: theme.text }} className="font-semibold text-sm">
            {type}
          </Text>
          <Text style={{ color: theme.gray400 }} className="text-xs">
            {date}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.emerald }} className="font-bold">
        {amount}
      </Text>
    </View>
  );
}

export function GoalTemplate({ icon, label, color, iconColor }) {
  const { theme } = useTheme();
  return (
    <Pressable
      className={`${color} px-4 py-3 rounded-2xl mr-3 flex-row items-center border border-black/5`}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text style={{ color: theme.gray700 }} className="ml-2 font-bold">
        {label}
      </Text>
    </Pressable>
  );
}

export function CurrentGoal({ title, target, saved, percentage }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
      className="p-5 rounded-2xl border"
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View
            style={{ backgroundColor: theme.purple + "20" }}
            className="p-2 rounded-lg mr-3"
          >
            <Ionicons name="rocket-outline" size={20} color={theme.purple} />
          </View>
          <View>
            <Text style={{ color: theme.text }} className="font-bold">
              {title}
            </Text>
            <Text style={{ color: theme.gray500 }} className="text-xs">
              Target: UGX {Number(target).toLocaleString()}
            </Text>
          </View>
        </View>
        <Text style={{ color: theme.purple }} className="font-bold">
          {percentage}%
        </Text>
      </View>
      {/* Progress Bar */}
      <View
        style={{ backgroundColor: theme.gray100 }}
        className="h-2.5 rounded-full overflow-hidden"
      >
        <View
          style={{
            width: `${percentage}%`,
            backgroundColor: theme.purple,
          }}
          className="h-full rounded-full"
        />
      </View>
      <Text style={{ color: theme.gray400 }} className="text-xs mt-2">
        <Text style={{ color: theme.text }} className="font-bold">
          UGX {Number(target - saved).toLocaleString()}
        </Text>{" "}
        remaining to reach target.
      </Text>
    </View>
  );
}
