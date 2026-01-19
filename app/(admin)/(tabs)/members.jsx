import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FilterChip,
  MemberRow,
  StatCard,
} from "../../../components/ui/membersSmallComponents";
import { MEMBERS_DATA } from "../../../constants/data";

export default function Members() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredMembers = useMemo(() => {
    return MEMBERS_DATA.filter((member) => {
      const matchesSearch =
        member.firstName.toLowerCase().includes(search.toLowerCase()) ||
        member.lastName.toLowerCase().includes(search.toLowerCase()) ||
        member.id.toLowerCase().includes(search.toLowerCase()) ||
        member.phone.includes(search);

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && member.status === "active") ||
        (filter === "risk" && member.loan.status === "overdue");

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

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
        <View className="mt-4 bg-white rounded-2xl px-4 py-3 flex-row items-center">
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
            label="At Risk"
            active={filter === "risk"}
            onPress={() => setFilter("risk")}
          />
        </View>
      </View>

      {/* SUMMARY STATS */}
      <View className="flex-row justify-between px-6 mt-6">
        <StatCard label="Total Members" value={MEMBERS_DATA.length} />
        <StatCard
          label="Overdue Loans"
          value={MEMBERS_DATA.filter((m) => m.loan.status === "overdue").length}
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
          <Text className="text-center text-gray-400 mt-20">
            No members found
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
