import { Pressable, ScrollView, Text, View } from "react-native";

export const RequestsHeader = ({
  theme,
  pendingCount,
  filterType,
  setFilterType,
}) => {
  return (
    <View
      style={{ backgroundColor: theme.primary }}
      className="px-6 pt-16 pb-8 rounded-b-3xl shadow-lg z-10"
    >
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-white text-2xl font-black tracking-tight">
            Requests
          </Text>
          <Text className="text-blue-200 text-xs font-medium mt-1">
            Review and approve member submissions
          </Text>
        </View>
        <View className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
          <Text className="text-white font-black text-xl text-center">
            {pendingCount}
          </Text>
          <Text className="text-blue-100 text-[10px] uppercase font-bold text-center">
            Pending
          </Text>
        </View>
      </View>

      {/* FILTER BAR */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mt-2"
      >
        {["All", "Deposits", "Withdrawals", "Loans"].map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilterType(f)}
            style={{
              backgroundColor:
                filterType === f ? "white" : "rgba(255,255,255,0.1)",
            }}
            className="px-4 py-2 rounded-full mr-2"
          >
            <Text
              style={{
                color: filterType === f ? theme.primary : "white",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
