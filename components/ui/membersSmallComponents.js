import { useTheme } from "@/context/ThemeProvider";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function FilterChip({ label, active, onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: active ? theme.card : "rgba(255,255,255,0.2)",
      }}
      className="px-4 py-2 rounded-full"
    >
      <Text
        style={{
          color: active ? theme.primary : theme.white,
        }}
        className="text-xs font-bold"
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function StatCard({ label, value, danger }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        shadowColor: theme.gray200,
      }}
      className="p-4 rounded-2xl w-[48%] shadow-sm"
    >
      <Text
        style={{ color: theme.gray400 }}
        className="text-[10px] uppercase font-bold"
      >
        {label}
      </Text>
      <Text
        style={{
          color: danger ? theme.rose : theme.text,
        }}
        className="text-2xl font-black mt-1"
      >
        {value}
      </Text>
    </View>
  );
}

export function MemberRow({ member }) {
  const router = useRouter();
  const { theme } = useTheme();

  const getStatusStyle = () => {
    if (member.loan.status === "overdue") {
      return { bg: theme.rose + "15", text: theme.rose };
    } else if (member.loan.status === "current") {
      return { bg: theme.orange + "15", text: theme.orange };
    } else {
      return { bg: theme.emerald + "15", text: theme.emerald };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <Pressable
      onPress={() => router.push(`/(admin)/memberProfiles/${member.id}`)}
      style={{
        backgroundColor: theme.card,
        borderColor: theme.gray100,
        shadowColor: theme.gray200,
      }}
      className="p-4 rounded-2xl mb-4 border shadow-sm"
    >
      <View className="flex-row justify-between items-center">
        {/* LEFT */}
        <View className="flex-row items-center">
          <View
            style={{ backgroundColor: theme.gray100 }}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            <Text style={{ color: theme.gray600 }} className="font-bold">
              {member.firstName.charAt(0)}
            </Text>
          </View>
          <View className="ml-3">
            <Text style={{ color: theme.text }} className="font-bold">
              {member.firstName} {member.lastName}
            </Text>
            <Text style={{ color: theme.gray400 }} className="text-[10px]">
              {member.id} • {member.phone}
            </Text>
          </View>
        </View>

        {/* RIGHT */}
        <View className="items-end">
          <View
            style={{ backgroundColor: statusStyle.bg }}
            className="px-2 py-1 rounded-md"
          >
            <Text
              style={{ color: statusStyle.text }}
              className="text-[10px] font-bold uppercase"
            >
              {member.loan.status}
            </Text>
          </View>
          <Text style={{ color: theme.gray400 }} className="text-[9px] mt-1">
            Last active: {member.lastActive}
          </Text>
        </View>
      </View>

      {/* FINANCIAL SNAPSHOT */}
      <View
        style={{ borderTopColor: theme.gray100 }}
        className="flex-row justify-between mt-4 border-t pt-3"
      >
        <Text style={{ color: theme.gray500 }} className="text-xs">
          Savings:{" "}
          <Text style={{ color: theme.text }} className="font-bold">
            UGX {member.savings.toLocaleString()}
          </Text>
        </Text>
        <Text style={{ color: theme.gray500 }} className="text-xs">
          Loan:{" "}
          <Text style={{ color: theme.text }} className="font-bold">
            UGX {member.loan.outstanding.toLocaleString()}
          </Text>
        </Text>
      </View>
    </Pressable>
  );
}
