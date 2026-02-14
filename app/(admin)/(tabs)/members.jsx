import useAdminAllInfo from "@/hooks/useAdminAllInfo";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FilterChip,
  MemberRow,
  StatCard,
} from "../../../components/ui/adminUI/membersSmallComponents";
import NoFetchResult from "../../../components/ui/sharedUI/NoResult";
import { generateAllMembersReportPdf } from "../../../utils/reports/generateSaccoDocument";

export default function Members() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { members } = useAdminAllInfo() || {};

  const filteredMembers = useMemo(() => {
    if (!Array.isArray(members)) return [];

    return members.filter((member) => {
      if (!member) return false;

      const searchLower = search.toLowerCase();

      const fName = (member.first_name || "").toLowerCase();
      const lName = (member.last_name || "").toLowerCase();
      const memNo = (member.membership_no || "").toLowerCase();
      const phone = member.phone_number || "";

      const matchesSearch =
        fName.includes(searchLower) ||
        lName.includes(searchLower) ||
        memNo.includes(searchLower) ||
        phone.includes(search);

      const matchesFilter =
        filter === "all" ||
        (member.member_status &&
          member.member_status?.toLowerCase() === filter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [members, search, filter]);

  const totalMembers = members?.length || 0;
  const suspendedCount = Array.isArray(members)
    ? members.filter((m) => m?.member_status === "suspended").length
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 w-full" edges={["top"]}>
      <View className="bg-arch-blue absolute w-full top-0 h-32" />
      <View>
        {/* HEADER SECTION */}
        <View className="px-6 pt-4 pb-3 bg-arch-blue rounded-b-3xl">
          <Text className="text-white text-2xl font-black">
            Members Management
          </Text>
          <Text className="text-white/70 text-xs mt-1">
            View, search, and manage SACCO members
          </Text>

          {/* SEARCH */}
          <View className="mt-4 bg-white rounded-2xl px-4 py-1 flex-row items-center shadow-sm">
            <Ionicons name="search" size={18} color="#94A3B8" />
            <TextInput
              placeholder="Search by name, ID or phone"
              value={search}
              onChangeText={setSearch}
              className="ml-3 flex-1 h-10 text-slate-800 font-medium"
            />
          </View>

          {/* FILTERS */}
          <View className="flex-row mt-3 gap-2 pb-2">
            {["all", "active", "suspended", "closed"].map((item) => (
              <FilterChip
                key={item}
                label={item.charAt(0).toUpperCase() + item.slice(1)}
                active={filter === item}
                onPress={() => setFilter(item)}
              />
            ))}
          </View>
        </View>

        {/* REPORT BUTTON */}
        <Pressable
          onPress={() => generateAllMembersReportPdf(filteredMembers)}
          className="mt-4 bg-white py-3 rounded-xl flex-row items-center justify-center mx-6 shadow-sm border border-slate-100"
        >
          <Ionicons name="document-text-outline" size={18} color="#07193f" />
          <Text className="ml-2 text-arch-blue font-bold text-sm">
            Generate Members Report
          </Text>
        </Pressable>

        {/* SUMMARY STATS */}
        <View className="flex-row justify-between px-6 mt-6 mb-4">
          <StatCard label="Total Members" value={totalMembers} />
          <StatCard label="Suspended" value={suspendedCount} danger />
        </View>

        <Text className="px-6 mb-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          Registry List
        </Text>
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View className="px-6">
            <MemberRow member={item} />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-col gap-2 items-center justify-center py-20">
            <NoFetchResult />
            <Text className="text-center text-gray-400 font-medium">
              No members found!
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}
