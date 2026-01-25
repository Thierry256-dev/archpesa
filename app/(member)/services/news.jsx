import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function News() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <View
        className="absolute top-0 w-full h-20"
        style={{ backgroundColor: theme.primary }}
      />

      {/* HEADER */}
      <View
        className="px-6 pt-4 pb-12 rounded-b-[40px]"
        style={{ backgroundColor: theme.primary }}
      >
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-xl"
            style={{ backgroundColor: theme.white + "1A" }}
          >
            <Ionicons name="arrow-back" size={20} color={theme.white} />
          </Pressable>
          <Text className="text-white text-xl font-bold ml-4">
            SACCO Updates
          </Text>
        </View>

        <View
          className="p-4 rounded-2xl flex-row items-center"
          style={{ backgroundColor: theme.white + "1A" }}
        >
          <Ionicons name="megaphone" size={24} color={theme.secondary} />
          <View className="ml-3">
            <Text className="text-white font-bold text-sm">Stay Informed</Text>
            <Text className="text-white/60 text-[10px]">
              Get the latest on dividends & meetings
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 -mt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* FEATURED STORY */}
        <View
          className="rounded-3xl shadow-sm overflow-hidden mb-6"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderWidth: 1,
          }}
        >
          <View
            className="h-32 items-center justify-center"
            style={{ backgroundColor: theme.blue }}
          >
            <Ionicons name="people" size={48} color={theme.white + "4D"} />
            <Text className="absolute bottom-3 left-4 text-white font-black text-lg">
              2026 Annual AGM
            </Text>
          </View>

          <View className="p-5">
            <View className="flex-row items-center mb-2">
              <View
                className="px-2 py-1 rounded-md"
                style={{ backgroundColor: theme.blue + "1A" }}
              >
                <Text
                  className="font-bold text-[10px] uppercase"
                  style={{ color: theme.blue }}
                >
                  Governance
                </Text>
              </View>
              <Text
                className="text-[10px] ml-3"
                style={{ color: theme.gray400 }}
              >
                Mar 12, 2026
              </Text>
            </View>

            <Text
              className="font-bold text-base mb-2"
              style={{ color: theme.text }}
            >
              Join us for the 15th General Meeting
            </Text>

            <Text
              className="text-xs leading-5"
              style={{ color: theme.gray500 }}
            >
              Discussing dividend allocations of 12% and the election of the new
              credit committee board members.
            </Text>

            <Pressable
              className="mt-4 pt-4 items-center"
              style={{ borderTopColor: theme.gray100, borderTopWidth: 1 }}
            >
              <Text
                className="font-bold text-xs"
                style={{ color: theme.primary }}
              >
                Read More & RSVP
              </Text>
            </Pressable>
          </View>
        </View>

        {/* RECENT UPDATES */}
        <Text className="font-bold text-lg mb-4" style={{ color: theme.text }}>
          Recent News
        </Text>

        <NewsCard
          tag="Finances"
          tagBg={theme.emerald + "1A"}
          tagText={theme.emerald}
          title="Dividend Payouts Phase 1"
          date="2 days ago"
          desc="All members with active share capital have received their partial interest."
        />

        <NewsCard
          tag="Security"
          tagBg={theme.orange + "1A"}
          tagText={theme.orange}
          title="System Maintenance"
          date="Jan 10, 2026"
          desc="Digital banking services will be offline for 2 hours this Sunday."
        />

        <NewsCard
          tag="Community"
          tagBg={theme.purple + "1A"}
          tagText={theme.purple}
          title="New School Fees Loan"
          date="Jan 05, 2026"
          desc="Lowering rates for the first term of 2026 to support parents."
        />

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- HELPER COMPONENT --- */

function NewsCard({ tag, tagBg, tagText, title, date, desc }) {
  const { theme } = useTheme();

  return (
    <Pressable
      className="p-5 rounded-3xl mb-4 shadow-sm"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
        borderWidth: 1,
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View
          className="px-2 py-1 rounded-md"
          style={{ backgroundColor: tagBg }}
        >
          <Text
            className="font-bold text-[10px] uppercase"
            style={{ color: tagText }}
          >
            {tag}
          </Text>
        </View>
        <Text className="text-[10px]" style={{ color: theme.gray400 }}>
          {date}
        </Text>
      </View>

      <Text className="font-bold text-sm mb-1" style={{ color: theme.text }}>
        {title}
      </Text>

      <Text
        className="text-[11px] leading-4"
        style={{ color: theme.gray500 }}
        numberOfLines={2}
      >
        {desc}
      </Text>
    </Pressable>
  );
}
