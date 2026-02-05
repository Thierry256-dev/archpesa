import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoFetchResult from "../../../../components/ui/sharedUI/NoResult";
import useAdminAllInfo from "../../../../hooks/useAdminAllInfo";
import { formatDateFull } from "../../../../utils/formatDateFull";

export default function PendingApplications() {
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  const { loanForms } = useAdminAllInfo();

  useEffect(() => {
    if (loanForms) {
      setApplications(loanForms);
    } else {
      setApplications([]);
    }
  }, [loanForms]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <View className="px-6 pt-6 pb-4 bg-white border-b border-slate-100">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-2xl font-black text-slate-900 tracking-tight">
            Loan Applications
          </Text>
          <View className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            <Text className="text-indigo-700 font-bold text-xs">
              {applications.length} Pending
            </Text>
          </View>
        </View>
        <Text className="text-slate-500 font-medium text-sm">
          Review and approve new loan requests.
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {applications.length === 0 ? (
          <View className="items-center justify-center py-20 opacity-60">
            <NoFetchResult />
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
              onPress={() =>
                router.push(`/(admin)/applications/loanApplications/${app.id}`)
              }
              className="bg-white p-4 rounded-2xl mb-4 shadow-sm shadow-slate-200 border border-slate-100 flex-row items-center active:scale-98 transition-transform"
            >
              <View className="h-14 w-14 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100 mr-4">
                <Text className="text-indigo-600 font-bold text-lg">
                  {app.full_name?.[0]}
                </Text>
              </View>

              {/* CONTENT */}
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text
                    className="font-bold text-slate-900 text-base mb-1"
                    numberOfLines={1}
                  >
                    {app.full_name}
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg overflow-hidden uppercase tracking-wide">
                    {formatDateFull(app.created_at)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-slate-500 text-xs font-medium mr-3">
                    {app.purpose}
                  </Text>

                  <Text className="text-slate-500 text-xs ml-1 font-medium">
                    UGX {app.requested_amount}
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
