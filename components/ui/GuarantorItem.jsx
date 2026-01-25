import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function GuarantorItem({
  name,
  loanType,
  amount,
  status,
  date,
  isWarning,
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.gray100,
        shadowColor: theme.gray200,
      }}
      className="p-5 rounded-3xl border mb-4 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View
            style={{ backgroundColor: theme.gray100 }}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="person-outline" size={20} color={theme.primary} />
          </View>
          <View className="ml-3">
            <Text style={{ color: theme.text }} className="font-bold">
              {name}
            </Text>
            <Text style={{ color: theme.gray400 }} className="text-[10px]">
              {loanType}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: isWarning
              ? theme.rose + "15"
              : theme.emerald + "15", // 15 = ~10% opacity hex
          }}
          className="px-3 py-1 rounded-full"
        >
          <Text
            style={{
              color: isWarning ? theme.rose : theme.emerald,
            }}
            className="text-[10px] font-bold"
          >
            {status}
          </Text>
        </View>
      </View>

      <View
        style={{ backgroundColor: theme.gray50 }}
        className="h-[1px] w-full mb-4"
      />

      <View className="flex-row justify-between items-center">
        <View>
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] uppercase font-bold"
          >
            Pledged Amount
          </Text>
          <Text style={{ color: theme.primary }} className="font-bold">
            {amount}
          </Text>
        </View>
        <Text
          style={{ color: theme.gray400 }}
          className="text-[10px] font-medium"
        >
          {date}
        </Text>
      </View>
    </View>
  );
}
