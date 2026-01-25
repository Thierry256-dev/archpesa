import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PendingApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from("member_applications")
      .select(
        `
        id,
        first_name,
        last_name,
        phone_number,
        district,
        submitted_at
      `,
      )
      .eq("status", "pending")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setApplications(data || []);
    }

    setLoading(false);
  };

  // Helper to format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-slate-400 text-sm mt-3 font-medium">
          Fetching Member Applications...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <View className="px-6 pt-6 pb-4 bg-white border-b border-slate-100">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-2xl font-black text-slate-900 tracking-tight">
            Applications
          </Text>
          <View className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            <Text className="text-indigo-700 font-bold text-xs">
              {applications.length} Pending
            </Text>
          </View>
        </View>
        <Text className="text-slate-500 font-medium text-sm">
          Review and approve new member requests.
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {applications.length === 0 ? (
          <View className="items-center justify-center py-20 opacity-60">
            <View className="w-16 h-16 bg-slate-200 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark-done" size={32} color="#64748B" />
            </View>
            <Text className="text-slate-900 font-bold text-lg">
              All caught up!
            </Text>
            <Text className="text-slate-500 text-center px-10 mt-1">
              There are no pending applications to review at the moment.
            </Text>
          </View>
        ) : (
          applications.map((app) => (
            <Pressable
              key={app.id}
              onPress={() => router.push(`/(admin)/applications/${app.id}`)}
              className="bg-white p-4 rounded-2xl mb-4 shadow-sm shadow-slate-200 border border-slate-100 flex-row items-center active:scale-98 transition-transform"
            >
              <View className="h-14 w-14 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100 mr-4">
                <Text className="text-indigo-600 font-bold text-lg">
                  {app.first_name?.[0]}
                  {app.last_name?.[0]}
                </Text>
              </View>

              {/* CONTENT */}
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text
                    className="font-bold text-slate-900 text-base mb-1"
                    numberOfLines={1}
                  >
                    {app.first_name} {app.last_name}
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg overflow-hidden uppercase tracking-wide">
                    {formatDate(app.submitted_at)}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <Ionicons name="location-outline" size={14} color="#94A3B8" />
                  <Text className="text-slate-500 text-xs ml-1 font-medium mr-3">
                    {app.district || "Unknown"}
                  </Text>

                  <Ionicons name="call-outline" size={14} color="#94A3B8" />
                  <Text className="text-slate-500 text-xs ml-1 font-medium">
                    {app.phone_number}
                  </Text>
                </View>
              </View>

              <View className="ml-2">
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
