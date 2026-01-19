import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function FilterChip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${
        active ? "bg-white" : "bg-white/20"
      }`}
    >
      <Text
        className={`text-xs font-bold ${
          active ? "text-arch-blue" : "text-white"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function StatCard({ label, value, danger }) {
  return (
    <View className="bg-white p-4 rounded-2xl w-[48%] shadow-sm">
      <Text className="text-gray-400 text-[10px] uppercase font-bold">
        {label}
      </Text>
      <Text
        className={`text-2xl font-black mt-1 ${
          danger ? "text-red-600" : "text-slate-900"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}

export function MemberRow({ member }) {
  const router = useRouter();
  const statusColor =
    member.loan.status === "overdue"
      ? "bg-red-50 text-red-600"
      : member.loan.status === "current"
        ? "bg-orange-50 text-orange-600"
        : "bg-emerald-50 text-emerald-600";

  return (
    <Pressable
      onPress={() => router.push(`/memberProfiles/${member.id}`)}
      className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm"
    >
      <View className="flex-row justify-between items-center">
        {/* LEFT */}
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
            <Text className="font-bold text-slate-600">
              {member.firstName.charAt(0)}
            </Text>
          </View>
          <View className="ml-3">
            <Text className="font-bold text-slate-900">
              {member.firstName} {member.lastName}
            </Text>
            <Text className="text-[10px] text-gray-400">
              {member.id} • {member.phone}
            </Text>
          </View>
        </View>

        {/* RIGHT */}
        <View className="items-end">
          <View className={`px-2 py-1 rounded-md ${statusColor}`}>
            <Text className="text-[10px] font-bold uppercase">
              {member.loan.status}
            </Text>
          </View>
          <Text className="text-[9px] text-gray-400 mt-1">
            Last active: {member.lastActive}
          </Text>
        </View>
      </View>

      {/* FINANCIAL SNAPSHOT */}
      <View className="flex-row justify-between mt-4 border-t border-gray-100 pt-3">
        <Text className="text-xs text-gray-500">
          Savings:{" "}
          <Text className="font-bold text-slate-800">
            UGX {member.savings.toLocaleString()}
          </Text>
        </Text>
        <Text className="text-xs text-gray-500">
          Loan:{" "}
          <Text className="font-bold text-slate-800">
            UGX {member.loan.outstanding.toLocaleString()}
          </Text>
        </Text>
      </View>
    </Pressable>
  );
}
