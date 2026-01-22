import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ExportButtons,
  LoanCard,
} from "../../../components/ui/adminLoansSubComponents";
import { MOCK_LOANS } from "../../../constants/data"; // Keeping your data source
import { generateLoansExcelReport } from "../../../utils/reports/generateLoansExcel";
import { generateLoansPdfReport } from "../../../utils/reports/generateLoansPdf";

const formatUGX = (amount) => {
  if (amount >= 1000000) return `UGX ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `UGX ${(amount / 1000).toFixed(0)}k`;
  return `UGX ${amount.toLocaleString()}`;
};

// Refined Professional Color Palette
const RISK_STYLES = {
  Performing: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: "checkmark-circle",
  },
  Watch: { bg: "bg-amber-100", text: "text-amber-700", icon: "alert-circle" },
  Substandard: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    icon: "warning",
  },
  Doubtful: { bg: "bg-rose-100", text: "text-rose-700", icon: "close-circle" },
  Loss: { bg: "bg-red-200", text: "text-red-900", icon: "skull" },
};

export default function Loans() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showRiskFilters, setShowRiskFilters] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [actionType, setActionType] = useState(null);

  /* ----------------Filter LOGIC---------------- */
  const filteredLoans = useMemo(() => {
    return MOCK_LOANS.filter((loan) => {
      const matchesStatus =
        statusFilter === "All" || loan.status === statusFilter;
      const matchesRisk =
        riskFilter === "All" || loan.risk_category === riskFilter;
      const matchesSearch =
        loan.member_name.toLowerCase().includes(search.toLowerCase()) ||
        loan.membership_no.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesRisk && matchesSearch;
    });
  }, [statusFilter, riskFilter, search]);

  const stats = useMemo(() => {
    const principal = filteredLoans.reduce((sum, l) => sum + l.principal, 0);
    const outstanding = filteredLoans.reduce(
      (sum, l) => sum + l.balance_due,
      0,
    );
    const arrearsCount = filteredLoans.filter(
      (l) => l.days_in_arrears > 0,
    ).length;
    // Calculate Portfolio Health (repayment %)
    const repaymentRate =
      principal > 0 ? ((principal - outstanding) / principal) * 100 : 0;

    return { principal, outstanding, arrearsCount, repaymentRate };
  }, [filteredLoans]);

  return (
    <SafeAreaView className="flex-1 bg-[#F1F5F9]">
      {/* 1. PROFESSIONAL HEADER & SEARCH */}
      <View className="px-5 pt-2 pb-4 bg-white border-b border-slate-100">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-bold text-slate-900">
              Loan Portfolio
            </Text>
            <Text className="text-xs text-slate-500 font-medium">
              Manage disbursements & arrears
            </Text>
          </View>
          <Pressable className="bg-slate-50 p-2 rounded-full border border-slate-100">
            <Ionicons name="stats-chart" size={20} color="#64748b" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-slate-100 rounded-xl px-3 h-11 border border-transparent focus:border-indigo-500">
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            placeholder="Search Member, ID, or Loan Ref..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-2 text-sm text-slate-900 font-medium h-full"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <FlatList
        data={filteredLoans}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        // HEADER COMPONENT (Metrics & Filters)
        ListHeaderComponent={
          <View className="mb-6">
            {/* 2. DASHBOARD SUMMARY CARD */}
            <View className="bg-arch-blue rounded-[20px] p-5 shadow-lg shadow-indigo-900/20 mb-6">
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                    Total Outstanding
                  </Text>
                  <Text className="text-3xl font-bold text-white tracking-tight">
                    {formatUGX(stats.outstanding)}
                  </Text>
                </View>
                <View className="bg-white/10 px-2 py-1 rounded-lg">
                  <Text className="text-white text-[10px] font-bold">
                    {filteredLoans.length} Active Loans
                  </Text>
                </View>
              </View>

              {/* Progress Visual */}
              <View>
                <View className="flex-row justify-between mb-1.5">
                  <Text className="text-slate-400 text-xs">
                    Principal: {formatUGX(stats.principal)}
                  </Text>
                  <Text className="text-emerald-400 text-xs font-bold">
                    {stats.repaymentRate.toFixed(1)}% Repaid
                  </Text>
                </View>
                <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <View
                    style={{ width: `${stats.repaymentRate}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </View>
              </View>

              <View className="mt-4 pt-3 border-t border-slate-800 flex-row gap-4">
                <View className="flex-row items-center">
                  <Ionicons name="warning" size={14} color="#f59e0b" />
                  <Text className="text-slate-300 text-xs ml-1.5">
                    <Text className="font-bold text-white">
                      {stats.arrearsCount}
                    </Text>{" "}
                    In Arrears
                  </Text>
                </View>
              </View>
            </View>
            <ExportButtons
              filteredLoans={filteredLoans}
              generateLoansExcelReport={generateLoansExcelReport}
              generateLoansPdfReport={generateLoansPdfReport}
            />
            {/* 3. HORIZONTAL TABS (Status) */}
            <View className="mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {["All", "Pending", "Disbursed", "Closed"].map((status) => (
                  <Pressable
                    key={status}
                    onPress={() => setStatusFilter(status)}
                    className={`mr-2 px-4 py-2 rounded-full border ${
                      statusFilter === status
                        ? "bg-arch-blue border-arch-blue"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${statusFilter === status ? "text-white" : "text-slate-600"}`}
                    >
                      {status}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* EXPANDABLE RISK FILTER */}
            <Pressable
              onPress={() => setShowRiskFilters(!showRiskFilters)}
              className="flex-row items-center justify-between bg-white p-3 rounded-xl border border-slate-200 mb-2"
            >
              <View className="flex-row items-center">
                <View
                  className={`w-2 h-2 rounded-full mr-2 ${riskFilter === "All" ? "bg-slate-300" : "bg-indigo-500"}`}
                />
                <Text className="text-sm font-semibold text-slate-700">
                  Risk Category:{" "}
                  <Text className="text-indigo-600">{riskFilter}</Text>
                </Text>
              </View>
              <Ionicons
                name={showRiskFilters ? "chevron-up" : "chevron-down"}
                size={16}
                color="#64748b"
              />
            </Pressable>

            {showRiskFilters && (
              <View className="flex-row flex-wrap gap-2 mt-2">
                {[
                  "All",
                  "Performing",
                  "Watch",
                  "Substandard",
                  "Doubtful",
                  "Loss",
                ].map((risk) => (
                  <Pressable
                    key={risk}
                    onPress={() => setRiskFilter(risk)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      riskFilter === risk
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-xs ${riskFilter === risk ? "text-indigo-700 font-bold" : "text-slate-500"}`}
                    >
                      {risk}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <LoanCard
            loan={item}
            RISK_STYLES={RISK_STYLES}
            formatUGX={formatUGX}
            onPress={() => setSelectedLoan(item)}
          />
        )}
        // Empty State
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-400 mt-2 font-medium">
              No loans found matching filters
            </Text>
          </View>
        }
      />
      {selectedLoan && (
        <View className="absolute inset-0 bg-black/50 justify-end mb-20">
          <View className="bg-white rounded-t-[28px] p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-slate-900">
                Loan Actions
              </Text>
              <Pressable onPress={() => setSelectedLoan(null)}>
                <Ionicons name="close" size={22} color="#64748b" />
              </Pressable>
            </View>

            {/* Loan Summary */}
            <View className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <Text className="font-bold text-slate-800">
                {selectedLoan.member_name}
              </Text>
              <Text className="text-xs text-slate-500 mb-2">
                {selectedLoan.membership_no}
              </Text>
              <Text className="text-sm text-slate-700">
                Principal:{" "}
                <Text className="font-bold">
                  {formatUGX(selectedLoan.principal)}
                </Text>
              </Text>
            </View>

            {/* ACTIONS */}
            {selectedLoan.status === "Pending" && (
              <Pressable
                onPress={() => setActionType("approve")}
                className="bg-emerald-600 py-4 rounded-xl mb-3"
              >
                <Text className="text-white text-center font-bold">
                  Approve Loan
                </Text>
              </Pressable>
            )}

            {selectedLoan.status === "Approved" && (
              <Pressable
                onPress={() => setActionType("disburse")}
                className="bg-arch-blue py-4 rounded-xl mb-3"
              >
                <Text className="text-white text-center font-bold">
                  Disburse Funds
                </Text>
              </Pressable>
            )}

            <Pressable onPress={() => setSelectedLoan(null)} className="py-3">
              <Text className="text-center text-slate-500 font-medium">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      {actionType && (
        <View className="absolute inset-0 bg-black/60 justify-center px-6">
          <View className="bg-white rounded-2xl p-6">
            <Ionicons
              name="alert-circle"
              size={42}
              color="#f59e0b"
              style={{ alignSelf: "center", marginBottom: 12 }}
            />

            <Text className="text-center font-bold text-slate-900 text-lg mb-2">
              Confirm {actionType === "approve" ? "Approval" : "Disbursement"}
            </Text>

            <Text className="text-center text-slate-600 text-sm mb-6">
              This action will be recorded permanently and cannot be undone.
            </Text>

            <Pressable
              onPress={() => {
                // TODO: Implement Supabase transaction to update loan status
                // This will handle both approval and disbursement actions
                // setActionType(null);
                // setSelectedLoan(null);
              }}
              className="bg-arch-blue py-4 rounded-xl mb-3 opacity-60"
            >
              <Text className="text-white text-center font-bold">
                Yes, Proceed
              </Text>
            </Pressable>

            <Pressable onPress={() => setActionType(null)}>
              <Text className="text-center text-slate-500 font-medium">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
