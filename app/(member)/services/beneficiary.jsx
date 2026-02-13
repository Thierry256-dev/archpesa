import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";

export default function Beneficiary() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();

  const { profile } = useMemberAllInfo();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      className="w-full max-w-md h-full md:h-[90vh] md:max-h-[850px]"
    >
      <View className="absolute top-0 w-full h-20 bg-arch-blue" />
      {/* HEADER */}
      <View
        style={{ backgroundColor: theme.primary }}
        className="px-6 pt-4 pb-12 rounded-b-[40px] "
      >
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="bg-white/10 p-2 rounded-xl"
            >
              <Ionicons name="arrow-back" size={20} color="#FFF" />
            </Pressable>
            <Text className="text-white text-xl font-bold ml-4">
              Beneficiary
            </Text>
          </View>
          <Pressable
            onPress={() => setIsEditing(!isEditing)}
            style={{ backgroundColor: theme.secondary }}
            className="px-4 py-2 rounded-full"
          >
            <Text className="text-white font-bold text-xs">
              {isEditing ? "Save" : "Update"}
            </Text>
          </Pressable>
        </View>

        {/* STATUS BADGE */}
        <View className="bg-emerald-500/20 self-start px-3 py-1.5 rounded-full flex-row items-center border border-emerald-500/30">
          <Ionicons name="checkmark-circle" size={14} color={theme.success} />
          <Text className="text-emerald-400 text-[10px] font-bold ml-1 uppercase">
            Records Verified
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 -mt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* PRIMARY BENEFICIARY CARD */}
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-slate-800 font-bold text-base">
              Primary Beneficiary
            </Text>
            <View className="bg-blue-50 px-2 py-1 rounded-md">
              <Text className="text-[#07193f] font-bold text-[10px]">
                100% Allocation
              </Text>
            </View>
          </View>

          <View className="space-y-5">
            <InfoField
              label="Full Name"
              value={profile?.next_of_kin_name || ""}
              isEditing={isEditing}
            />
            <InfoField
              label="Relationship"
              value={profile?.next_of_kin_relationship || ""}
              isEditing={isEditing}
            />
            <InfoField
              label="Phone Number"
              value={profile?.next_of_kin_phone || ""}
              isEditing={isEditing}
            />
            <InfoField
              label="Address"
              value={profile?.next_of_kin_address || ""}
              isEditing={isEditing}
            />
          </View>
        </View>

        {/* POLICY INFORMATION */}
        <View className="mt-8 bg-blue-50/50 p-5 rounded-3xl border border-blue-100">
          <View className="flex-row items-center mb-3">
            <Ionicons name="shield-half-outline" size={20} color="#07193f" />
            <Text className="text-[#07193f] font-bold ml-2">Legacy Policy</Text>
          </View>
          <Text className="text-slate-600 text-xs leading-5">
            In accordance with SACCO bylaws, your beneficiary is entitled to
            100% of your accumulated savings and dividends. Changes take 24
            hours to be legally processed.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- HELPER COMPONENTS --- */

function InfoField({ label, value, isEditing }) {
  return (
    <View className="mb-4">
      <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          defaultValue={value}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm"
        />
      ) : (
        <Text className="text-slate-800 font-bold text-sm bg-slate-50/50 py-3 px-4 rounded-xl">
          {value}
        </Text>
      )}
    </View>
  );
}
