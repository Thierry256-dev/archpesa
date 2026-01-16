import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function News() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="absolute top-0 w-full h-20 bg-arch-blue" />
      {/* HEADER */}
      <View className="bg-[#07193f] px-6 pt-4 pb-12 rounded-b-[40px]">
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="bg-white/10 p-2 rounded-xl"
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </Pressable>
          <Text className="text-white text-xl font-bold ml-4">
            SACCO Updates
          </Text>
        </View>

        <View className="bg-white/10 p-4 rounded-2xl flex-row items-center">
          <Ionicons name="megaphone" size={24} color="#10b981" />
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
        {/* FEATURED STORY: The AGM (Most Important Governance Event) */}
        <View className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <View className="bg-blue-600 h-32 items-center justify-center">
            <Ionicons name="people" size={48} color="rgba(255,255,255,0.3)" />
            <Text className="absolute bottom-3 left-4 text-white font-black text-lg">
              2026 Annual AGM
            </Text>
          </View>
          <View className="p-5">
            <View className="flex-row items-center mb-2">
              <View className="bg-blue-100 px-2 py-1 rounded-md">
                <Text className="text-blue-700 font-bold text-[10px] uppercase">
                  Governance
                </Text>
              </View>
              <Text className="text-slate-400 text-[10px] ml-3">
                Mar 12, 2026
              </Text>
            </View>
            <Text className="text-slate-800 font-bold text-base mb-2">
              Join us for the 15th General Meeting
            </Text>
            <Text className="text-slate-500 text-xs leading-5">
              Discussing dividend allocations of 12% and the election of the new
              credit committee board members.
            </Text>
            <Pressable className="mt-4 border-t border-slate-50 pt-4 items-center">
              <Text className="text-[#07193f] font-bold text-xs">
                Read More & RSVP
              </Text>
            </Pressable>
          </View>
        </View>

        {/* RECENT UPDATES LIST */}
        <Text className="text-slate-800 font-bold text-lg mb-4">
          Recent News
        </Text>

        <NewsCard
          tag="Finances"
          tagColor="bg-emerald-100 text-emerald-700"
          title="Dividend Payouts Phase 1"
          date="2 days ago"
          desc="All members with active share capital have received their partial interest."
        />

        <NewsCard
          tag="Security"
          tagColor="bg-orange-100 text-orange-700"
          title="System Maintenance"
          date="Jan 10, 2026"
          desc="Digital banking services will be offline for 2 hours this Sunday."
        />

        <NewsCard
          tag="Community"
          tagColor="bg-purple-100 text-purple-700"
          title="New School Fees Loan"
          date="Jan 05, 2026"
          desc="Lowering rates for the first term of 2026 to support parents."
        />

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- HELPER COMPONENTS --- */

function NewsCard({ tag, tagColor, title, date, desc }) {
  return (
    <Pressable className="bg-white p-5 rounded-3xl border border-slate-100 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <View className={`${tagColor.split(" ")[0]} px-2 py-1 rounded-md`}>
          <Text
            className={`${tagColor.split(" ")[1]} font-bold text-[10px] uppercase`}
          >
            {tag}
          </Text>
        </View>
        <Text className="text-slate-400 text-[10px]">{date}</Text>
      </View>
      <Text className="text-slate-800 font-bold text-sm mb-1">{title}</Text>
      <Text className="text-slate-500 text-[11px] leading-4" numberOfLines={2}>
        {desc}
      </Text>
    </Pressable>
  );
}
