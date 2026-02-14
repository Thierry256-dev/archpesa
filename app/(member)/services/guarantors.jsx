import { useTheme } from "@/context/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RequestCard from "../../../components/cards/RequestCard";
import GuarantorItem from "../../../components/ui/memberUI/GuarantorItem";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";

export default function Guarantors() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("backing");
  const [confirmingRequest, setConfirmingRequest] = useState(null);

  const { guarantorRequests } = useMemberAllInfo() || [];

  const acceptedRequests = guarantorRequests.filter(
    (r) => r.status === "accepted",
  );

  const pendingRequests = guarantorRequests.filter(
    (r) => r.status === "pending",
  );

  const calculateTotalGuaranteed = (data) => {
    if (!data || !Array.isArray(data)) return 0;

    return data.reduce((sum, item) => {
      const amount = Number(item.guaranteed_amount) || 0;
      return Math.floor(sum + amount).toLocaleString();
    }, 0);
  };

  const handleReject = async (guarantor_user_id, loan_application_id) => {
    await supabase.rpc("reject_loan_guarantee_request", {
      p_guarantor_user_id: guarantor_user_id,
      p_loan_application_id: loan_application_id,
    });

    alert(`Rejected guarantorship request from member.`);
  };

  const handleFinalAccept = async (guarantor_user_id, loan_application_id) => {
    await supabase.rpc("accept_loan_guarantee_request", {
      p_guarantor_user_id: guarantor_user_id,
      p_loan_application_id: loan_application_id,
    });

    setConfirmingRequest(null);

    alert("Success! Your savings have been pledged as collateral.");
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background }}
      className="flex-1 w-full max-w-md h-full md:h-[90vh] md:max-h-[850px]"
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
            className="bg-white/10 p-2 rounded-xl"
            onPress={router.back}
          >
            <Ionicons name="arrow-back" size={20} color={theme.white} />
          </Pressable>
          <Text className="text-white text-xl font-bold ml-4">
            Guarantorship
          </Text>
        </View>

        {/* SUMMARY MINI-CARD */}
        <View className="bg-white/10 border border-white/20 p-4 rounded-2xl flex-row justify-between">
          <View>
            <Text className="text-white/60 text-[10px] uppercase font-bold">
              Total Pledged
            </Text>
            <Text className="text-white text-lg font-bold">
              UGX {calculateTotalGuaranteed(acceptedRequests)}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white/60 text-[10px] uppercase font-bold">
              Risk Status
            </Text>
            <Text
              className="text-lg font-bold"
              style={{ color: theme.success }}
            >
              Low
            </Text>
          </View>
        </View>
      </View>

      {/* TABS */}
      <View className="flex-row mx-6 -mt-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
        {["backing", "requests"].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 py-3 rounded-xl"
            style={{
              backgroundColor:
                activeTab === tab ? theme.primary : "transparent",
            }}
          >
            <Text
              className={`text-center font-bold text-xs ${
                activeTab === tab ? "text-white" : "text-slate-400"
              }`}
            >
              {tab === "backing" ? "I am Backing" : "New Requests"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        className="flex-1 px-6 mt-6"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "backing" ? (
          <View>
            {acceptedRequests.length > 0 ? (
              acceptedRequests?.map((guarantee, index) => (
                <GuarantorItem
                  key={index}
                  name={guarantee.guarantor_full_name}
                  amount={guarantee.guaranteed_amount}
                  date={guarantee.created_at}
                  status={guarantee.status}
                />
              ))
            ) : (
              <View className="items-center justify-center mt-20">
                <View className="bg-slate-100 p-6 rounded-full mb-4">
                  <Ionicons
                    name="mail-outline"
                    size={60}
                    color={theme.gray400}
                  />
                </View>
                <Text className="text-slate-800 font-bold text-lg">
                  No Guarantees attached to you
                </Text>
                <Text className="text-slate-400 text-sm text-center px-10 mt-2">
                  When you accept a member quarantorship request, it will appear
                  here.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  data={req}
                  onAccept={() => setConfirmingRequest(req)}
                  onReject={() =>
                    handleReject(req.guarantor_user_id, req.loan_application_id)
                  }
                />
              ))
            ) : (
              <View className="items-center justify-center mt-20">
                <View className="bg-slate-100 p-6 rounded-full mb-4">
                  <Ionicons
                    name="mail-open-outline"
                    size={60}
                    color={theme.gray400}
                  />
                </View>
                <Text className="text-slate-800 font-bold text-lg">
                  No New Requests
                </Text>
                <Text className="text-slate-400 text-sm text-center px-10 mt-2">
                  When a member requests you to guarantee their loan, it will
                  appear here.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* WARNING MODAL */}
      <Modal visible={!!confirmingRequest} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View
            className="w-full rounded-[32px] p-8"
            style={{ backgroundColor: theme.card }}
          >
            <View className="items-center mb-6">
              <View
                className="p-4 rounded-full mb-4"
                style={{ backgroundColor: theme.warning + "20" }}
              >
                <Ionicons name="warning" size={32} color={theme.warning} />
              </View>
              <Text
                className="text-xl font-black text-center"
                style={{ color: theme.text }}
              >
                Financial Commitment
              </Text>
            </View>

            <Text className="text-slate-500 text-center text-sm leading-5 mb-6">
              By accepting,{" "}
              <Text style={{ color: theme.text, fontWeight: "bold" }}>
                UGX {Math.floor(confirmingRequest?.guaranteed_amount)}
              </Text>{" "}
              of your savings will be{" "}
              <Text style={{ color: theme.error, fontWeight: "bold" }}>
                locked
              </Text>{" "}
              as collateral for {confirmingRequest?.guarantor_full_name}.
            </Text>

            <View className="bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100">
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle"
                  size={18}
                  color={theme.gray500}
                />
                <Text className="text-slate-500 text-[11px] ml-2 flex-1">
                  You will not be able to withdraw this amount until the
                  borrower pays off their loan balance.
                </Text>
              </View>
            </View>

            <View className="flex-row gap-x-3">
              <Pressable
                className="flex-1 py-4 rounded-2xl items-center"
                style={{ backgroundColor: theme.gray100 }}
                onPress={() => setConfirmingRequest(null)}
              >
                <Text style={{ color: theme.gray600 }} className="font-bold">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  handleFinalAccept(
                    confirmingRequest?.guarantor_user_id,
                    confirmingRequest?.loan_application_id,
                  )
                }
                className="flex-1 py-4 rounded-2xl items-center"
                style={{ backgroundColor: theme.primary }}
              >
                <Text className="text-white font-bold">I Understand</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
