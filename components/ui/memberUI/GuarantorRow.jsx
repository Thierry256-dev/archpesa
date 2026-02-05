import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function GuarantorRow({ name, status, amount, isLast }) {
  const { theme } = useTheme();
  const isApproved = status === "Approved";

  return (
    <View
      style={{
        borderBottomColor: theme.gray50,
        borderBottomWidth: !isLast ? 1 : 0,
      }}
      className="flex-row justify-between items-center py-3"
    >
      <View className="flex-row items-center">
        <View
          style={{
            backgroundColor: isApproved
              ? theme.emerald + "20"
              : theme.orange + "20",
          }}
          className="w-8 h-8 rounded-full items-center justify-center"
        >
          <Ionicons
            name={isApproved ? "checkmark" : "time-outline"}
            size={16}
            color={isApproved ? theme.emerald : theme.orange}
          />
        </View>
        <View className="ml-3">
          <Text style={{ color: theme.text }} className="font-bold text-sm">
            {name}
          </Text>
          <Text style={{ color: theme.gray400 }} className="text-[10px]">
            {amount} guaranteed
          </Text>
        </View>
      </View>
      <Text
        style={{
          color: isApproved ? theme.emerald : theme.orange,
        }}
        className="text-xs font-bold"
      >
        {status}
      </Text>
    </View>
  );
}
