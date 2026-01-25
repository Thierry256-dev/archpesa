import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export function ChartBar({ label, height, active }) {
  const { theme } = useTheme();
  const rawHeight = height || 0;
  const barHeight = height ? height * 4 : rawHeight;
  const isActive = active;

  return (
    <Pressable className="items-center w-8 h-full justify-end">
      {isActive && (
        <View
          style={{ backgroundColor: theme.gray800 }}
          className="px-2 pt-4 rounded mb-2 shadow-sm"
        >
          <View
            style={{ backgroundColor: theme.gray800 }}
            className="absolute -bottom-1 left-1 w-2 h-2 rotate-45"
          />
        </View>
      )}
      <View
        className={`w-3`}
        style={{
          height: barHeight,
          backgroundColor: isActive ? theme.primary : theme.gray300,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      />
      <Text
        style={{ color: theme.gray400 }}
        className="text-[10px] mt-2 font-medium"
      >
        {label}
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

export function CurrentGoal({ icon, title, target, completed, remaining }) {
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
            <Ionicons name={icon} size={20} color={theme.purple} />
          </View>
          <View>
            <Text style={{ color: theme.text }} className="font-bold">
              {title}
            </Text>
            <Text style={{ color: theme.gray500 }} className="text-xs">
              Target: UGX {target}M
            </Text>
          </View>
        </View>
        <Text style={{ color: theme.purple }} className="font-bold">
          {completed}%
        </Text>
      </View>
      {/* Progress Bar */}
      <View
        style={{ backgroundColor: theme.gray100 }}
        className="h-2.5 rounded-full overflow-hidden"
      >
        <View
          style={{
            width: `${completed}%`,
            backgroundColor: theme.purple,
          }}
          className="h-full rounded-full"
        />
      </View>
      <Text style={{ color: theme.gray400 }} className="text-xs mt-2">
        <Text style={{ color: theme.text }} className="font-bold">
          UGX {remaining}M
        </Text>{" "}
        remaining to reach target.
      </Text>
    </View>
  );
}
