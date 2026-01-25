import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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
  ReplacementItem,
  TabButton,
} from "../../../components/ui/loansSmallComponents";

export default function MemberLoans() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);

  const [isReplaceModalVisible, setIsReplaceModalVisible] = useState(false);
  const [targetRejectionId, setTargetRejectionId] = useState(null);

  const handleReplaceGuarantor = (newMember) => {
    setIsReplaceModalVisible(false);
    alert(`Replacement request sent to ${newMember.name}`);
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
                UGX 2,400,000
              </Text>
            </View>
            <View className="bg-amber-50 px-2 py-1 rounded-lg">
              <Text className="text-amber-700 text-[10px] font-bold">
                14% APR
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
                60% Paid
              </Text>
            </View>
            <View
              style={{ backgroundColor: theme.gray100 }}
              className="h-2.5 rounded-full overflow-hidden"
            >
              <View
                style={{ backgroundColor: theme.secondary }}
                className="h-full w-[60%] rounded-full"
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
                UGX 200,000
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
                Feb 05, 2026
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{ backgroundColor: theme.background }}
          className="rounded-t-3xl mt-6"
        >
          {/* 2. TAB TOGGLE */}
          <View
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
            className="flex-row mx-6 mt-4 bg-black/5 p-1 rounded-2xl border"
          >
            <TabButton
              label="Pending"
              name="pending"
              activeTab={activeTab}
              onPress={() => setActiveTab("pending")}
            />
            <TabButton
              label="Loan History"
              name="history"
              activeTab={activeTab}
              onPress={() => setActiveTab("history")}
            />
          </View>
          {/* 3. GUARANTOR STATUS */}
          {activeTab === "pending" && (
            <>
              <View className="px-6 mt-6 animate-in fade-in duration-500">
                <View
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  }}
                  className="rounded-3xl p-6 shadow-sm border mb-6"
                >
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="bg-orange-100 px-3 py-1 rounded-full">
                      <Text className="text-orange-600 font-bold text-[10px] uppercase">
                        Awaiting Approval
                      </Text>
                    </View>
                    <Text
                      style={{ color: theme.gray400 }}
                      className="text-xs font-medium"
                    >
                      Applied: Jan 12, 2026
                    </Text>
                  </View>
                  <Text
                    style={{ color: theme.gray500 }}
                    className="text-xs font-bold uppercase tracking-wider"
                  >
                    Requested Amount
                  </Text>
                  <Text
                    style={{ color: theme.text }}
                    className="text-lg font-black"
                  >
                    UGX 2,500,000
                  </Text>

                  <Text
                    style={{ color: theme.gray500 }}
                    className="pt-1 text-xs italic"
                  >
                    &quot;Business expansion for retail shop inventory.&quot;
                  </Text>
                </View>
                {/* 4. GUARANTOR TRACKING (NEW SECTION) */}
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
                    <GuarantorStatusRow
                      name="Sarah Namuli"
                      memberId="M-042"
                      status="Accepted"
                      pledge="UGX 1,250,000"
                    />
                    <GuarantorStatusRow
                      name="John Bosco"
                      memberId="M-115"
                      status="Pending"
                      pledge="UGX 1,250,000"
                    />
                    <GuarantorStatusRow
                      name="Grace Akello"
                      memberId="M-089"
                      status="Rejected"
                      isLast
                    />
                  </View>

                  {/* Conditional Alert if someone rejected */}
                  <Pressable
                    onPress={() => {
                      setTargetRejectionId("M-089"); // The ID of Grace Akello who rejected
                      setIsReplaceModalVisible(true);
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
                        Guarantor Rejected
                      </Text>
                      <Text className="text-red-600/70 text-[10px]">
                        Tap to find a replacement for Grace Akello
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={theme.red}
                    />
                  </Pressable>
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
            </>
          )}
          {activeTab === "history" && (
            <View className="px-6 mt-8">
              <Text
                style={{ color: theme.text }}
                className="text-lg font-bold mb-4"
              >
                Completed Loans
              </Text>
              <HistoryItem
                title="Emergency Loan"
                amount="UGX 500k"
                date="Dec 2025"
                status="Cleared"
              />
              <HistoryItem
                title="School Fees Loan"
                amount="UGX 1.2M"
                date="Aug 2025"
                status="Cleared"
              />
              <HistoryItem
                title="Boda Boda Loan"
                amount="UGX 3.5M"
                date="Jan 2024"
                status="Settled"
              />
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
            <View className="flex-row flex-wrap justify-between gap-y-3">
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
      <Modal visible={isLoanFormVisible} transparent animationType="slide">
        <LoanApplicationForm onClose={() => setIsLoanFormVisible(false)} />
      </Modal>
      {/* REPLACEMENT SEARCH MODAL */}
      <Modal visible={isReplaceModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View
            style={{ backgroundColor: theme.card }}
            className="rounded-t-[40px] h-[70%] p-8"
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text
                  style={{ color: theme.text }}
                  className="text-xl font-black"
                >
                  Replace Guarantor
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
                placeholder="Enter Name or Member ID..."
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
                Suggested Members
              </Text>

              {/* Mock Search Results */}
              <ReplacementItem
                name="Peter Sempala"
                id="M-202"
                onSelect={() =>
                  handleReplaceGuarantor({
                    name: "Peter Sempala",
                    memberId: "M-202",
                  })
                }
              />
              <ReplacementItem
                name="Doreen Lwanga"
                id="M-156"
                onSelect={() =>
                  handleReplaceGuarantor({
                    name: "Doreen Lwanga",
                    memberId: "M-156",
                  })
                }
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
