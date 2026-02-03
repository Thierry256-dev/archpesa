import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [application, setApplication] = useState([]);
  const [memberAccounts, setMemberAccounts] = useState([]);
  const [memberGuarantors, setMemberGuarantors] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    type: null,
  });

  useEffect(() => {
    if (id) {
      fetchApplication();
      fetchMemberGuarantors();
    }
    if (application.length !== 0) {
      fetchMemberAccounts(application);
    }
  }, [id, application]);

  const fetchApplication = async () => {
    const { data, error } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      Alert.alert("Error", error.message);
      router.back();
      return;
    }

    setApplication(data);
    setLoading(false);
  };

  const fetchMemberAccounts = async (app) => {
    const { data, error } = await supabase
      .from("member_accounts")
      .select("*")
      .eq("user_id", app.user_id);

    if (error) {
      Alert.alert("Error", error.message);
      router.back();
      return;
    }

    setMemberAccounts(data);
    setLoading(false);
  };

  const fetchMemberGuarantors = async () => {
    const { data, error } = await supabase
      .from("loan_guarantors")
      .select("*")
      .eq("loan_application_id", id);

    if (error) {
      Alert.alert("Error", error.message);
      router.back();
      return;
    }

    setMemberGuarantors(data);
    setLoading(false);
  };

  const handleApprove = () => {
    setConfirmModal({ visible: true, type: "approve" });
  };

  const handleReject = () => {
    setConfirmModal({ visible: true, type: "reject" });
  };

  const processDecision = async () => {
    const isApprove = confirmModal.type === "approve";

    if (!isApprove && rejectionReason.trim().length < 5) {
      Alert.alert(
        "Rejection reason required",
        "Please provide a clear reason for rejection (at least 5 characters).",
      );
      return;
    }

    setConfirmModal({ visible: false, type: null });
    setSubmitting(true);

    const rpcName = isApprove
      ? "approve_loan_application"
      : "reject_loan_application";

    const params = isApprove
      ? { p_loan_application_id: id }
      : {
          p_loan_application_id: id,
          p_rejection_reason: rejectionReason.trim(),
        };

    const { error } = await supabase.rpc(rpcName, params);

    setSubmitting(false);

    if (error) {
      Alert.alert("Action Failed", error.message);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-slate-400 font-medium mt-4">
          Loading Details...
        </Text>
      </View>
    );
  }

  if (!application) return null;

  // --- UI HELPER COMPONENTS ---
  const SectionHeader = ({ title, icon }) => (
    <View className="flex-row items-center mb-4 mt-2">
      <View className="bg-indigo-50 p-1.5 rounded-lg mr-2">
        <Ionicons name={icon} size={16} color="#4F46E5" />
      </View>
      <Text className="text-sm font-bold text-slate-900 uppercase tracking-widest">
        {title}
      </Text>
    </View>
  );

  const InfoField = ({ label, value, fullWidth = false }) => (
    <View className={`mb-2 ${fullWidth ? "w-full" : "w-[48%]"}`}>
      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </Text>
      <Text className="text-slate-900 font-semibold text-md leading-5">
        {value || "—"}
      </Text>
    </View>
  );

  const GuarantorField = ({ label, value, status, fullWidth = false }) => (
    <View className={`mb-2 ${fullWidth ? "w-full" : "w-[48%]"}`}>
      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </Text>
      <View className="flex-row justify-between">
        <Text className="text-slate-900 font-semibold text-md leading-5">
          {value || "—"}
        </Text>
        <Text
          style={{
            color: status === "pending" ? "#ea580c" : "#10b981",
          }}
          className="text-xs"
        >
          {status}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* HEADER WITH BACK BUTTON */}
      <SafeAreaView
        edges={["top"]}
        className="bg-white z-10 border-b border-slate-100"
      >
        <View className="px-4 py-3 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </Pressable>
          <View>
            <Text className="text-lg font-black text-slate-900">
              Application Review
            </Text>
            <Text className="text-xs text-slate-500 font-medium">
              ID: #{id.slice(0, 8)}...
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO PROFILE CARD */}
        <View className="items-center mb-8">
          <View className="h-24 w-24 bg-indigo-100 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
            <Text className="text-3xl font-black text-indigo-600">
              {application.full_name?.[0]}
            </Text>
          </View>
          <Text className="text-2xl font-black text-slate-900 text-center">
            {application.full_name}
          </Text>
          <View className="flex-row items-center mt-2 bg-white px-3 py-1 rounded-full border border-slate-200">
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text className="text-xs font-bold text-slate-500 ml-1">
              Submitted Pending Review
            </Text>
          </View>
        </View>

        {/* LOAN INFO */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-5">
          <SectionHeader title="LOAN INFO" icon="person" />
          <View className="flex-col flex-wrap justify-between">
            <InfoField
              label="Loan Category"
              value={application.loan_category}
            />
            <InfoField
              label="Requested Amount"
              value={
                application.requested_amount
                  ? `UGX ${Number(application.requested_amount).toLocaleString()}`
                  : "—"
              }
            />
            <InfoField
              label="Loan Purpose"
              value={application.purpose}
              fullWidth
            />

            <InfoField
              label="Interest Rate"
              value={`${application.interest_rate * 100}%`}
            />
          </View>
        </View>

        {/* FINANCIAL ACCOUNTS */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-5">
          <SectionHeader title="Wallet Balance" icon="wallet" />
          <View className="flex-row flex-wrap justify-between">
            {memberAccounts.map((acc, index) => (
              <InfoField
                key={index}
                label={acc.account_type}
                value={Number(acc.balance).toLocaleString()}
              />
            ))}
          </View>
        </View>

        {/* LOAN GUARANTORS */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-5">
          <SectionHeader title="Loan Guarantors" icon="people" />
          <View className="flex-row flex-wrap justify-between">
            {memberGuarantors.map((gtr, index) => (
              <GuarantorField
                key={index}
                label="Name"
                status={gtr.status}
                value={gtr.guarantor_full_name}
                fullWidth={true}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FIXED ACTION BAR */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 border-t border-slate-100 shadow-lg shadow-black/5 flex-row gap-4">
        <Pressable
          disabled={submitting}
          onPress={handleReject}
          className="flex-1 bg-red-50 h-14 rounded-xl items-center justify-center border border-red-100 active:bg-red-100"
        >
          <Text className="text-red-600 font-bold text-base">Reject</Text>
        </Pressable>

        <Pressable
          disabled={submitting}
          onPress={handleApprove}
          className="flex-[2] bg-emerald-600 h-14 rounded-xl items-center justify-center shadow-lg shadow-emerald-200 active:bg-emerald-700 flex-row"
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-white font-bold text-base mr-2">
                Approve Membership
              </Text>
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </>
          )}
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModal.visible}
        onRequestClose={() => setConfirmModal({ visible: false, type: null })}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          className="flex-1 justify-end bg-black/60"
        >
          <Pressable
            className="flex-1"
            onPress={() => setConfirmModal({ visible: false, type: null })}
          />
          <View className="bg-white rounded-t-[40px] px-8 pt-8 pb-12 shadow-2xl">
            {/* Dynamic Visual Indicator */}
            <View className="items-center mb-6">
              <View
                className={`w-20 h-20 rounded-full items-center justify-center border-4 ${
                  confirmModal.type === "approve"
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-red-50 border-red-100"
                }`}
              >
                <Ionicons
                  name={
                    confirmModal.type === "approve"
                      ? "shield-checkmark"
                      : "alert-circle"
                  }
                  size={40}
                  color={
                    confirmModal.type === "approve" ? "#10B981" : "#EF4444"
                  }
                />
              </View>
            </View>

            <Text className="text-2xl font-black text-slate-900 text-center mb-3">
              {confirmModal.type === "approve"
                ? "Approve Member"
                : "Reject Application"}
            </Text>

            <Text className="text-slate-500 text-center text-base leading-6 mb-8 px-4">
              {confirmModal.type === "approve"
                ? `You are about to admit ${application.first_name} into the SACCO. This will create their official accounts.`
                : `Are you sure you want to reject ${application.first_name}'s application? This action is permanent and cannot be undone.`}
            </Text>
            {confirmModal.type === "reject" && (
              <View className="mb-6">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Reason for Rejection
                </Text>
                <View className="bg-slate-100 rounded-2xl px-4 py-3">
                  <TextInput
                    value={rejectionReason}
                    onChangeText={setRejectionReason}
                    placeholder="Explain clearly why this application was rejected..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    className="text-slate-900 font-medium"
                  />
                </View>
              </View>
            )}

            {/* Dynamic Action Buttons */}
            <View className="gap-y-4">
              <Pressable
                onPress={processDecision}
                className={`h-16 rounded-2xl flex-row items-center justify-center shadow-lg ${
                  confirmModal.type === "approve"
                    ? "bg-emerald-600 shadow-emerald-200"
                    : "bg-red-600 shadow-red-200"
                }`}
              >
                <Text className="text-white font-black text-lg mr-2">
                  {confirmModal.type === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
                </Text>
                <Ionicons
                  name={
                    confirmModal.type === "approve"
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={20}
                  color="white"
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  setRejectionReason("");
                  setConfirmModal({ visible: false, type: null });
                }}
                className="h-16 rounded-2xl items-center justify-center"
              >
                <Text className="text-slate-400 font-bold text-lg">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
