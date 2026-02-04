import useAdminAllInfo from "@/hooks/useAdminAllInfo";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FilterChip,
  MemberRow,
  StatCard,
} from "../../../components/ui/membersSmallComponents";
import NoFetchResult from "../../../components/ui/NoResult";
import { generateAllMembersReportPdf } from "../../../utils/reports/generateSaccoDocument";

export default function Members() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { members } = useAdminAllInfo();

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchLower = search.toLowerCase();

      const matchesSearch =
        member.first_name?.toLowerCase().includes(searchLower) ||
        member.last_name?.toLowerCase().includes(searchLower) ||
        member.membership_no?.toLowerCase().includes(searchLower) ||
        member.phone_number?.includes(search);

      const matchesFilter =
        filter === "all" ||
        (member.member_status &&
          member.member_status?.toLowerCase() === filter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [members, search, filter]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-20">
      {/* HEADER */}
      <View className="bg-arch-blue absolute w-full top-0 h-32" />
      <View className="px-6 pt-4 pb-3 bg-arch-blue rounded-b-3xl">
        <Text className="text-white text-2xl font-black">
          Members Management
        </Text>
        <Text className="text-white/70 text-xs mt-1">
          View, search, and manage SACCO members
        </Text>

        {/* SEARCH */}
        <View className="mt-4 bg-white rounded-2xl px-4 py-1 flex-row items-center">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search by name, ID or phone"
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1 text-slate-800 font-medium"
          />
        </View>

        {/* FILTERS */}
        <View className="flex-row mt-3 gap-2">
          <FilterChip
            label="All"
            active={filter === "all"}
            onPress={() => setFilter("all")}
          />
          <FilterChip
            label="Active"
            active={filter === "active"}
            onPress={() => setFilter("active")}
          />
          <FilterChip
            label="Suspended"
            active={filter === "suspended"}
            onPress={() => setFilter("suspended")}
          />
          <FilterChip
            label="Closed"
            active={filter === "closed"}
            onPress={() => setFilter("closed")}
          />
        </View>
      </View>
      <Pressable
        onPress={() => generateAllMembersReportPdf(filteredMembers)}
        className="mt-4 bg-white py-3 rounded-xl flex-row items-center justify-center mx-6"
      >
        <Ionicons name="document-text-outline" size={18} color="#07193f" />
        <Text className="ml-2 text-arch-blue font-bold text-sm">
          Generate Members Report
        </Text>
      </Pressable>

      {/* SUMMARY STATS */}
      <View className="flex-row justify-between px-6 mt-6">
        <StatCard label="Total Members" value={members?.length || 0} />
        <StatCard
          label="Suspended Members"
          value={members.filter((m) => m.member_status === "suspended").length}
          danger
        />
      </View>

      {/* MEMBERS LIST */}
      <ScrollView
        className="flex-1 px-6 mt-6"
        showsVerticalScrollIndicator={false}
      >
        {filteredMembers.map((member, index) => (
          <MemberRow key={index} member={member} />
        ))}

        {filteredMembers.length === 0 && (
          <View className="flex-col gap-2 items-center justify-center">
            <NoFetchResult />
            <Text className="text-center text-gray-400">No members found!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
