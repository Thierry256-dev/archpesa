import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import { useMemberApplication } from "@/hooks/memberHooks/useMemberApplication";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Components & Hooks ---
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";
import {
  ApprovedLoanCard,
  GuarantorReplacementModal,
  GuarantorStatusRow,
  HistoryItem,
  LoanActionCard,
  LoanStatusCard,
} from "../../../components/ui/memberUI/loansSmallComponents";
import NoFetchResult from "../../../components/ui/sharedUI/NoResult";
import { useSearchMemberProfiles } from "../../../hooks/sharedHooks/useSearchMemberProfiles";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";

// --- Utils ---
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateFull } from "../../../utils/formatDateFull";
import { getNextDate } from "../../../utils/getNextDate";

export default function MemberLoans() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);
  const [isReplaceModalVisible, setIsReplaceModalVisible] = useState(false);
  const [rejectedGuarantor, setRejectedGuarantor] = useState(null);

  const { data: application } = useMemberApplication(user?.id);
  const { loanApplications, loanGuarantors, loans = [] } = useMemberAllInfo();

  const {
    currentLoan,
    approvedLoan,
    pendingApps,
    rejectedApps,
    completedLoans,
    loanProgress,
    combinedHistory,
  } = useMemo(() => {
    const active =
      loans.find(
        (l) => l.outstanding_balance > 0 && l.status === "Disbursed",
      ) || {};

    const progress = active.total_payable
      ? ((active.amount_paid / active.total_payable) * 100).toFixed(2)
      : "0";

    const completed = loans.filter((l) => l.status === "Completed");
    const rejected = loanApplications.filter((a) => a.status === "rejected");

    const history = [
      ...completed.map((l) => ({ ...l, type: "completed" })),
      ...rejected.map((l) => ({ ...l, type: "rejected" })),
    ];

    return {
      currentLoan: active,
      approvedLoan: loans.find((l) => l.status === "Approved"),
      pendingApps: loanApplications.filter((a) => a.status === "pending"),
      rejectedApps: rejected,
      completedLoans: completed,
      loanProgress: progress,
      combinedHistory: history,
    };
  }, [loans, loanApplications]);

  const isApprovedMember = application?.status === "approved";

  // --- Handlers ---
  const handleReplaceGuarantor = async (newMember) => {
    setIsReplaceModalVisible(false);
    try {
      await supabase.rpc("replace_rejected_guarantor", {
        p_loan_application_id: rejectedGuarantor?.loan_application_id,
        p_rejected_guarantor_id: rejectedGuarantor?.guarantor_user_id,
        p_new_first_name: newMember.first_name,
        p_new_last_name: newMember.last_name,
      });
      Alert.alert("Success", `Request sent to ${newMember.first_name}`);
    } catch (error) {
      Alert.alert("Error", "Failed to replace guarantor.");
    }
  };

  const openReplaceModal = (guarantor) => {
    setRejectedGuarantor(guarantor);
    setIsReplaceModalVisible(true);
  };

  // --- Render Sections ---
  const renderDebtSummary = () => (
    <View
      style={{ backgroundColor: theme.card }}
      className="mx-6 mt-6 rounded-3xl p-6 shadow-xl shadow-black/10 mb-6"
    >
      {/* Balance Header */}
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text
            style={{ color: theme.gray400 }}
            className="text-xs font-bold uppercase"
          >
            Remaining Balance
          </Text>
          <Text
            style={{ color: theme.text }}
            className="text-3xl font-extrabold"
          >
            {formatCurrency(currentLoan.outstanding_balance || 0)}
          </Text>
        </View>
        {currentLoan.interest_rate && (
          <View className="bg-amber-50 px-2 py-1 rounded-lg">
            <Text className="text-amber-700 text-[10px] font-bold">
              {currentLoan.interest_rate * 100}% APR
            </Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <View className="flex-row justify-between mb-2">
          <Text
            style={{ color: theme.gray500 }}
            className="text-xs font-medium"
          >
            Repayment Progress
          </Text>
          <Text style={{ color: theme.text }} className="text-xs font-bold">
            {loanProgress}% Paid
          </Text>
        </View>
        <View
          style={{ backgroundColor: theme.gray100 }}
          className="h-2.5 rounded-full overflow-hidden"
        >
          <View
            style={{
              backgroundColor: theme.secondary,
              width: `${loanProgress}%`,
            }}
            className="h-full rounded-full"
          />
        </View>
      </View>

      {/* Footer Info */}
      <View
        style={{ borderColor: theme.gray50 }}
        className="flex-row justify-between border-t pt-4"
      >
        <View>
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] uppercase"
          >
            Next Installment
          </Text>
          <Text style={{ color: theme.text }} className="font-bold">
            {currentLoan.outstanding_balance
              ? formatCurrency(
                  currentLoan.total_payable / (currentLoan.tenure_months || 1),
                )
              : "UGX 0"}
          </Text>
        </View>
        <View className="items-end">
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] uppercase"
          >
            Due Date
          </Text>
          <Text style={{ color: theme.orange }} className="font-bold">
            {currentLoan.disbursed_at
              ? getNextDate(currentLoan.disbursed_at)
              : "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderActiveSection = () => {
    // 1. If Loan is Approved but not Disbursed
    if (approvedLoan) {
      return (
        <View className="px-6 mb-8">
          <Text
            style={{ color: theme.text }}
            className="text-lg font-bold mb-4"
          >
            Approved Loan
          </Text>
          <ApprovedLoanCard loan={approvedLoan} />
        </View>
      );
    }

    // 2. If Applications are Pending
    if (pendingApps.length > 0) {
      return (
        <View className="px-6 mb-8">
          <Text
            style={{ color: theme.text }}
            className="text-lg font-bold mb-4"
          >
            Pending Application
          </Text>
          {pendingApps.map((app, index) => {
            const rejectedReqs = loanGuarantors?.filter(
              (g) => g.status === "rejected",
            );
            const activeReqs = loanGuarantors?.filter(
              (g) => g.status === "pending" || g.status === "accepted",
            );

            return (
              <View key={index} className="mb-6">
                <LoanStatusCard app={app} />

                {/* Guarantor Tracking Section */}
                <View
                  className="mt-6 p-5 rounded-3xl border shadow-sm"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  }}
                >
                  <Text
                    style={{ color: theme.text }}
                    className="font-bold mb-4"
                  >
                    Guarantor Pledges
                  </Text>

                  {activeReqs?.map((g, i) => (
                    <GuarantorStatusRow
                      key={i}
                      name={g.guarantor_full_name}
                      status={g.status}
                      pledge={g.guaranteed_amount}
                    />
                  ))}

                  {/* Rejected Guarantor Action */}
                  {rejectedReqs?.map((r, i) => (
                    <Pressable
                      key={i}
                      onPress={() => openReplaceModal(r)}
                      className="mt-4 bg-red-50 p-4 rounded-xl flex-row items-center border border-red-100"
                    >
                      <Ionicons name="alert-circle" size={20} color="#dc2626" />
                      <View className="ml-3 flex-1">
                        <Text className="text-red-700 font-bold text-xs">
                          {r.guarantor_full_name} Rejected
                        </Text>
                        <Text className="text-red-500 text-[10px]">
                          Tap to replace this guarantor.
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#dc2626"
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      );
    }

    // 3. Default: Empty State / CTA
    return (
      <View className="px-6 mb-8">
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
          className="rounded-3xl p-6 border items-center"
        >
          <View
            style={{ backgroundColor: theme.gray100 }}
            className="p-4 rounded-full mb-4"
          >
            <Ionicons
              name="document-text-outline"
              size={28}
              color={theme.gray500}
            />
          </View>
          <Text
            style={{ color: theme.text }}
            className="text-lg font-black text-center"
          >
            No Pending Applications
          </Text>
          <Text
            style={{ color: theme.gray400 }}
            className="text-xs text-center mt-2 mb-6 px-4"
          >
            Ready to grow? Apply for a new loan today.
          </Text>
          <Pressable
            disabled={!isApprovedMember}
            onPress={() => {
              if (currentLoan) {
                alert(
                  "You cannot apply for another loan until you complete the current loan.",
                );
              } else {
                setIsLoanFormVisible(true);
              }
            }}
            style={{
              backgroundColor: isApprovedMember ? theme.primary : theme.gray300,
            }}
            className="px-8 py-3 rounded-full active:opacity-90"
          >
            <Text className="text-white font-bold text-xs">Apply for Loan</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // --- List Header (Combines Dashboard & Actions) ---
  const ListHeader = useCallback(
    () => (
      <View>
        {renderDebtSummary()}

        {renderActiveSection()}

        <View className="px-6 mb-8">
          <Text
            style={{ color: theme.text }}
            className="text-lg font-bold mb-4"
          >
            Special Loan Types
          </Text>
          <View className="flex-row flex-wrap justify-between gap-3">
            <LoanActionCard
              title="Emergency"
              icon="flash"
              color="bg-amber-500"
              desc="Instant 24h loan"
            />
            <LoanActionCard
              title="Education"
              icon="school"
              color="bg-blue-600"
              desc="Low interest fees"
            />
            <LoanActionCard
              title="Business"
              icon="briefcase"
              color="bg-green-600"
              desc="Grow capital"
            />
            <LoanActionCard
              title="Development"
              icon="home"
              color="bg-purple-600"
              desc="Long term"
            />
          </View>
        </View>

        {/* List Title */}
        <View className="px-6 mb-4">
          <Text style={{ color: theme.text }} className="text-lg font-bold">
            Loan History
          </Text>
        </View>
      </View>
    ),
    [currentLoan, approvedLoan, pendingApps, loanGuarantors, theme],
  );

  // --- List Item Renderer ---
  const renderHistoryItem = ({ item }) => (
    <View className="px-6 mb-2">
      <HistoryItem
        title={item.purpose}
        amount={
          item.type === "completed"
            ? item.principal_amount
            : item.requested_amount
        }
        status={item.status}
        date={formatDateFull(
          item.type === "completed" ? item.completed_at : item.reviewed_at,
        )}
        reason={item.rejection_reason}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background }}
      className="relative flex-1"
    >
      {/* Absolute Background Header */}
      <View
        style={{ backgroundColor: theme.primary }}
        className="absolute top-0 w-full h-64 rounded-b-[32px]"
      />

      {/* Page Title */}
      <View className="px-6 pt-4 pb-2 flex-row justify-center items-center">
        <Text style={{ color: theme.white }} className="text-lg font-bold">
          Loan Center
        </Text>
      </View>

      {/* Main Content (FlatList) */}
      <FlatList
        data={combinedHistory}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderHistoryItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View className="items-center py-10 px-6">
            <NoFetchResult />
            <Text
              style={{ color: theme.text }}
              className="text-xs text-center mt-2"
            >
              No history found. Your completed loans will appear here.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modals */}
      <Modal visible={isLoanFormVisible} transparent animationType="slide">
        <LoanApplicationForm onClose={() => setIsLoanFormVisible(false)} />
      </Modal>

      <GuarantorReplacementModal
        visible={isReplaceModalVisible}
        onClose={() => setIsReplaceModalVisible(false)}
        rejectedGuarantor={rejectedGuarantor}
        onReplace={handleReplaceGuarantor}
        theme={theme}
        useSearchMemberProfiles={useSearchMemberProfiles}
      />
    </SafeAreaView>
  );
}
