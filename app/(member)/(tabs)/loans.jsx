import { useTheme } from "@/context/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";
import {
  ApproverRow,
  GuarantorStatusRow,
  HistoryItem,
  LoanActionCard,
  LoanStatusCard,
  ReplacementItem,
} from "../../../components/ui/loansSmallComponents";
import NoFetchResult from "../../../components/ui/NoResult";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";
import { useSearchMemberProfiles } from "../../../hooks/useSearchMemberProfiles";
import { formatDateFull } from "../../../utils/formatDateFull";
import { getNextDate } from "../../../utils/getNextDate";

export default function Membeaoans() {
  const { theme } = useTheme();
  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectedGuarantor, setRejectedGuarantor] = useState([]);
  const [isReplaceModalVisible, setIsReplaceModalVisible] = useState(false);

  const { isSearching, searchResults } = useSearchMemberProfiles(searchQuery);

  const { loanApplications, loanGuarantors, loans = [] } = useMemberAllInfo();

  const currentLoan = useMemo(() => {
    if (!loans?.length) return null;

    return (
      loans.find(
        (l) =>
          l.outstanding_balance > 0 &&
          ["Approved", "Disbursed", "Restructured"].includes(l.status),
      ) ?? null
    );
  }, [loans]);

  const loanProgress = (
    (currentLoan.amount_paid / currentLoan.total_payable) *
    100
  ).toFixed(2);

  const completedLoans = loans?.filter((l) => l.status === "Completed");

  const pendingLoanApplications = loanApplications.filter(
    (a) => a.status === "pending",
  );

  const rejectedApplications = loanApplications.filter(
    (a) => a.status === "rejected",
  );

  const rejectedRequests = loanGuarantors?.filter(
    (g) => g.status === "rejected",
  );

  const filteredRequests = loanGuarantors?.filter(
    (g) => g.status === "pending" || g.status === "accepted",
  );

  const handleReplaceGuarantor = async (
    newMember = {},
    loanId,
    rejectedGuarantorId,
  ) => {
    setIsReplaceModalVisible(false);

    await supabase.rpc("replace_rejected_guarantor", {
      p_loan_application_id: loanId,
      p_rejected_guarantor_id: rejectedGuarantorId,
      p_new_first_name: newMember.first_name,
      p_new_last_name: newMember.last_name,
    });

    alert(`Replacement request sent to ${newMember.first_name}`);
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background }}
      className="relative flex-1"
    >
      {/* BACKGROUND HEADER */}
      <View
        style={{ backgroundColor: theme.primary }} // Replaced bg-arch-blue
        className="absolute top-0 w-full h-64 rounded-b-[20px]"
      />

      {/* HEADER */}
      <View className="px-6 pt-4 pb-2 flex-row justify-center items-center">
        <Text style={{ color: theme.white }} className="text-lg font-bold">
          Loan Center
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 1. THE DEBT SUMMARY CARD */}
        <View
          style={{ backgroundColor: theme.card }}
          className="mx-6 mt-6 rounded-3xl p-6 shadow-xl shadow-black/10"
        >
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text
                style={{ color: theme.gray400 }}
                className="text-xs font-bold uppercase"
              >
                Total Outstanding
              </Text>
              <Text
                style={{ color: theme.text }}
                className="text-3xl font-extrabold"
              >
                UGX {Number(currentLoan.outstanding_balance).toLocaleString()}
              </Text>
            </View>
            <View className="bg-amber-50 px-2 py-1 rounded-lg">
              <Text className="text-amber-700 text-[10px] font-bold">
                {currentLoan.interest_rate * 100}% APR
              </Text>
            </View>
          </View>

          {/* Progress Bar for current loan */}
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
                  width: loanProgress,
                }}
                className="h-full rounded-full"
              />
            </View>
          </View>

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
                UGX{" "}
                {Math.floor(
                  currentLoan.outstanding_balance / currentLoan.tenure_months,
                ).toLocaleString()}
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
                {getNextDate(currentLoan.disbursed_at)}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{ backgroundColor: theme.background }}
          className="rounded-t-3xl mt-6"
        >
          <Text
            style={{ color: theme.text }}
            className="text-lg font-bold ml-6 mb-4"
          >
            Pending Applications
          </Text>
          {/* 3. LOAN STATUS */}
          {pendingLoanApplications.length > 0 ? (
            pendingLoanApplications.map((app, index) => (
              <View
                key={index}
                className="px-6 mt-6 animate-in fade-in duration-500"
              >
                <LoanStatusCard app={app} />

                {/* 4. GUARANTOR TRACKING */}
                <View className="mb-6">
                  <View className="flex-row justify-between items-center mb-4 px-1">
                    <Text
                      style={{ color: theme.text }}
                      className="text-lg font-bold"
                    >
                      Guarantor Pledges
                    </Text>
                    <View className="bg-indigo-50 px-2 py-1 rounded-md">
                      <Text className="text-indigo-600 font-bold text-[10px]">
                        Step 1 of 3
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    }}
                    className="rounded-3xl p-5 shadow-sm border"
                  >
                    {filteredRequests.length > 0 &&
                      filteredRequests.map((gtr, index) => (
                        <GuarantorStatusRow
                          key={index}
                          name={gtr.guarantor_full_name}
                          status={gtr.status}
                          pledge={gtr.guaranteed_amount}
                        />
                      ))}
                  </View>

                  {/* Conditional Alert if someone rejected */}
                  {rejectedRequests.length > 0 &&
                    rejectedRequests.map((r, index) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          setIsReplaceModalVisible(true);
                          setRejectedGuarantor(r);
                        }}
                        className="mt-4 bg-red-50 p-4 rounded-3xl flex-row items-center border border-red-100 active:bg-red-100"
                      >
                        <View
                          style={{ backgroundColor: theme.red }}
                          className="p-2 rounded-full"
                        >
                          <Ionicons
                            name="swap-horizontal"
                            size={16}
                            color={theme.white}
                          />
                        </View>
                        <View className="ml-3 flex-1">
                          <Text
                            style={{ color: theme.red }}
                            className="text-xs font-bold"
                          >
                            {r.guarantor_full_name} Rejected
                          </Text>
                          <Text className="text-red-600/70 text-[10px]">
                            Tap to find a replacement.
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={theme.red}
                        />
                      </Pressable>
                    ))}
                </View>
                <View className="flex-row justify-between items-center mb-4 px-1">
                  <Text
                    style={{ color: theme.text }}
                    className="text-lg font-bold"
                  >
                    Official Approvals
                  </Text>
                  <View className="bg-blue-50 px-2 py-1 rounded-md">
                    <Text className="text-blue-600 font-bold text-[10px]">
                      Step 2 of 3
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  }}
                  className="rounded-3xl p-4 shadow-sm border"
                >
                  <ApproverRow
                    name="President"
                    person="Dr. David K."
                    status="Pending"
                    icon="ribbon"
                  />
                  <ApproverRow
                    name="Treasurer"
                    person="Sarah Namuli"
                    status="Approved"
                    icon="wallet"
                  />
                  <ApproverRow
                    name="Credit Manager"
                    person="Musa Johnson"
                    status="Approved"
                    icon="shield-checkmark"
                    isLast
                  />
                </View>
                <Text
                  style={{ color: theme.gray400 }}
                  className="text-[10px] mt-4 italic text-center px-6"
                >
                  *Approvals follow a hierarchy. Once the Credit Manager and
                  Treasurer approve, the President gives final sign-off.
                </Text>
              </View>
            ))
          ) : (
            <View className="px-6 mt-6 animate-in fade-in duration-500">
              <View
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
                className="rounded-3xl p-6 shadow-sm border"
              >
                <View className="items-center py-6">
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
                    No Pending Loan Applications
                  </Text>

                  <Text
                    style={{ color: theme.gray400 }}
                    className="text-xs text-center mt-2 px-6"
                  >
                    You don’t have any active loan requests at the moment. Apply
                    for a loan and track approvals here.
                  </Text>

                  <Pressable
                    onPress={() => setIsLoanFormVisible(true)}
                    style={{ backgroundColor: theme.primary }}
                    className="mt-6 px-6 py-3 rounded-full active:opacity-90"
                  >
                    <Text className="text-white font-bold text-xs">
                      Apply for a Loan
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/*Completed loans */}
          <View className="px-6 mt-8">
            <Text
              style={{ color: theme.text }}
              className="text-lg font-bold mb-4"
            >
              Completed Loans
            </Text>
            {completedLoans && completedLoans.length > 0 ? (
              completedLoans.map((cl, index) => (
                <HistoryItem
                  title={cl.purpose}
                  amount={cl.principal_amount}
                  status={cl.status}
                  date={formatDateFull(cl.completed_at)}
                  key={index}
                />
              ))
            ) : (
              <View className="flex-col items-center py-4">
                <NoFetchResult />
                <Text className="text-xs" style={{ color: theme.text }}>
                  You have not yet completed any loan!
                </Text>
              </View>
            )}
          </View>

          {/*Rejected Loans */}
          {rejectedApplications.length > 0 && (
            <View className="px-6 mt-8">
              <Text
                style={{ color: theme.text }}
                className="text-lg font-bold mb-4"
              >
                Reject Loans
              </Text>
              {rejectedApplications.map((a, index) => (
                <HistoryItem
                  title={a.purpose}
                  amount={a.requested_amount}
                  status={a.status}
                  date={formatDateFull(a.reviewed_at)}
                  reason={a.rejection_reason}
                  key={index}
                />
              ))}
            </View>
          )}
          {/* 4. LOAN OFFERS / QUICK ACTIONS */}
          <View className="px-6 mt-8 pb-20">
            <Text
              style={{ color: theme.text }}
              className="text-lg font-bold mb-4"
            >
              Special Loan types
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
                desc="Low interest fees"
              />
              <LoanActionCard
                title="Development"
                icon="home"
                color="bg-purple-600"
                desc="Low interest fees"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* FLOATING ACTION BUTTON */}
      {pendingLoanApplications.length > 0 && (
        <View className="absolute bottom-5 right-4 pt-2 pb-20">
          <Pressable
            onPress={() => setIsLoanFormVisible(true)}
            style={{
              backgroundColor: theme.blue,
              shadowColor: theme.gray900,
            }}
            className="py-2 px-4 rounded-full flex- items-center justify-center shadow-lg"
          >
            <Ionicons name="add-circle-outline" size={24} color={theme.white} />
            <Text style={{ color: theme.white }} className="text-xs font-bold">
              Apply for loan
            </Text>
          </Pressable>
        </View>
      )}
      <Modal visible={isLoanFormVisible} transparent animationType="slide">
        <LoanApplicationForm onClose={() => setIsLoanFormVisible(false)} />
      </Modal>
      {/* REPLACEMENT SEARCH MODAL */}
      <Modal visible={isReplaceModalVisible} animationType="fade" transparent>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View
            style={{ backgroundColor: theme.card }}
            className="rounded-[40px] h-[50%] w-[90%] p-8"
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text
                  style={{ color: theme.text }}
                  className="text-xl font-black"
                >
                  Replace {rejectedGuarantor.guarantor_full_name}
                </Text>
                <Text style={{ color: theme.gray400 }} className="text-xs">
                  Search for a new member to pledge
                </Text>
              </View>
              <Pressable
                onPress={() => setIsReplaceModalVisible(false)}
                style={{ backgroundColor: theme.gray100 }}
                className="p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color={theme.black} />
              </Pressable>
            </View>

            {/* Search Input */}
            <View
              style={{
                backgroundColor: theme.gray50,
                borderColor: theme.gray100,
              }}
              className="border rounded-2xl px-4 py-4 flex-row items-center mb-6"
            >
              <Ionicons name="search" size={20} color={theme.gray400} />
              <TextInput
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
                placeholder="Enter Name"
                style={{ color: theme.text }}
                placeholderTextColor={theme.gray400}
                className="flex-1 ml-3 font-bold"
                autoFocus
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{ color: theme.gray400 }}
                className="text-[10px] font-bold uppercase mb-4 ml-1"
              >
                Search Results
              </Text>
              {isSearching ? (
                <>
                  <Text
                    style={{ color: theme.text }}
                    className="text-xs text-center py-4 mb-4"
                  >
                    Searching..
                  </Text>
                </>
              ) : (
                searchResults.map((result, index) => (
                  <ReplacementItem
                    key={index}
                    name={`${result.first_name} ${result.last_name}`}
                    id={result.membership_no}
                    onSelect={() =>
                      handleReplaceGuarantor(
                        {
                          first_name: result.first_name,
                          last_name: result.last_name,
                        },
                        rejectedGuarantor?.loan_application_id,
                        rejectedGuarantor?.guarantor_user_id,
                      )
                    }
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
