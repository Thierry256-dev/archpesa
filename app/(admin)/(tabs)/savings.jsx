import {
  generateSaccoExcel,
  generateSaccoSavingsReport,
} from "@/utils/reports/generateSaccoDocument";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionRow } from "../../../components/ui/adminUI/adminSavingsSubComponents";
import { SAVINGS_LEDGER } from "../../../constants/data";

export default function SavingsLedgerPage() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);

  //Date Range
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [range, setRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Defaults to 1st of current month
    end: new Date(),
  });
  const [activePicker, setActivePicker] = useState(null); // 'start', 'end', or null
  const [isFilterActive, setIsFilterActive] = useState(false);

  const filteredTransactions = useMemo(() => {
    return SAVINGS_LEDGER.transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const matchesType = filterType === "all" || tx.type === filterType;

      const matchesSearch =
        tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRange =
        !isFilterActive ||
        (txDate >= range.start.setHours(0, 0, 0, 0) &&
          txDate <= range.end.setHours(23, 59, 59, 999));

      return matchesType && matchesSearch && matchesRange;
    });
  }, [filterType, searchQuery, range, isFilterActive]);

  const totals = useMemo(() => {
    let deposits = 0;
    let withdrawals = 0;

    SAVINGS_LEDGER.transactions.forEach((tx) => {
      if (tx.type === "deposit") deposits += tx.amount;
      if (tx.type === "withdrawal") withdrawals += tx.amount;
    });

    const closingBalance =
      SAVINGS_LEDGER.openingBalance + deposits - withdrawals;
    const totalVolume = deposits + withdrawals;
    // Calculate percentage for visual bar (avoid divide by zero)
    const depositPercent =
      totalVolume > 0 ? (deposits / totalVolume) * 100 : 50;

    return { deposits, withdrawals, closingBalance, depositPercent };
  }, []);

  // Helper for Currency
  const formatMoney = (amount) => Number(amount).toLocaleString();

  const handleExport = () => {
    generateSaccoSavingsReport(
      "Savings Ledger Report",
      { memberName: "UMOJA SACCO", memberId: "0001" }, // Meta
      filteredTransactions, // Your API Data
      totals, // Your calculated totals
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* --- HEADER SECTION --- */}
      <View className="px-6 py-4 bg-white border-b border-slate-100 flex-row justify-between items-center sticky">
        <View>
          <Text className="text-xl font-bold text-slate-900">
            Treasury Ledger
          </Text>
        </View>
        <Pressable className="bg-slate-100 p-2 rounded-full">
          <Ionicons name="wallet-outline" size={20} color="#64748b" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* --- 1. FINANCIAL DASHBOARD CARD --- */}
        <View className="bg-arch-blue p-6 rounded-[24px] shadow-lg shadow-blue-900/20 mb-6">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
                Net Position
              </Text>
              <Text className="text-white text-3xl font-black">
                <Text className="text-lg font-medium text-blue-300">
                  {SAVINGS_LEDGER.currency}{" "}
                </Text>
                {formatMoney(totals.closingBalance)}
              </Text>
            </View>
            <View className="bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
              <Text className="text-white text-[10px] font-bold">
                {SAVINGS_LEDGER.accountType}
              </Text>
            </View>
          </View>

          {/* Opening Balance Context */}
          <View className="mb-4">
            <Text className="text-blue-300/80 text-xs">
              Opening Balance: {formatMoney(SAVINGS_LEDGER.openingBalance)}
            </Text>
          </View>

          {/* Cash Flow Visualizer */}
          <View className="bg-black/20 p-4 rounded-2xl">
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                <Text className="text-white text-xs font-bold">Inflow</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-white text-xs font-bold">Outflow</Text>
                <View className="w-2 h-2 rounded-full bg-rose-400 ml-2" />
              </View>
            </View>

            {/* Visual Bar */}
            <View className="h-2 bg-slate-700 rounded-full flex-row overflow-hidden mb-2">
              <View
                style={{ width: `${totals.depositPercent}%` }}
                className="bg-emerald-400 h-full"
              />
              <View className="flex-1 bg-rose-400 h-full" />
            </View>

            <View className="flex-row justify-between">
              <Text className="text-emerald-400 font-bold text-xs">
                +{formatMoney(totals.deposits)}
              </Text>
              <Text className="text-rose-400 font-bold text-xs">
                -{formatMoney(totals.withdrawals)}
              </Text>
            </View>
          </View>
        </View>

        {/* --- 2. REPORTING & FILTERS TOOLBAR --- */}
        <View className="flex-row gap-3 mb-6">
          {/* Search Input */}
          <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-xl px-3 h-12">
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              placeholder="Search ID or Ref..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-sm text-slate-800 font-medium"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Export Button */}
          <Pressable
            onPress={() => setShowExportOptions(!showExportOptions)}
            className="bg-emerald-500 h-12 rounded-xl px-2 items-center justify-center shadow-sm shadow-emerald-200"
          >
            <Ionicons name="download-outline" size={20} color="white" />
            <Text className="text-white text-xs px-1 font-bold">
              {" "}
              Download Ledger
            </Text>
          </Pressable>
        </View>

        {/* Export Options Dropdown (Conditional) */}
        {showExportOptions && (
          <>
            <View className="bg-white p-5 rounded-2xl border border-slate-100 mb-6 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="font-bold text-slate-800">
                  Report Duration
                </Text>
                {isFilterActive && (
                  <Pressable onPress={() => setIsFilterActive(false)}>
                    <Text className="text-rose-500 text-xs font-bold">
                      Clear Range
                    </Text>
                  </Pressable>
                )}
              </View>

              <View className="flex-row gap-3 mb-4">
                {/* From Date */}
                <Pressable
                  onPress={() => {
                    setActivePicker("start");
                    setShowDatePicker(true);
                  }}
                  className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200"
                >
                  <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    From
                  </Text>
                  <Text className="text-slate-700 font-bold text-xs">
                    {range.start.toLocaleDateString("en-GB")}
                  </Text>
                </Pressable>

                <View className="justify-center">
                  <Ionicons name="arrow-forward" size={16} color="#cbd5e1" />
                </View>

                {/* To Date */}
                <Pressable
                  onPress={() => {
                    setActivePicker("end");
                    setShowDatePicker(true);
                  }}
                  className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200"
                >
                  <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    To
                  </Text>
                  <Text className="text-slate-700 font-bold text-xs">
                    {range.end.toLocaleDateString("en-GB")}
                  </Text>
                </Pressable>
              </View>

              <View className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex-row justify-around">
                <Pressable
                  onPress={() => {
                    setIsFilterActive(true);
                    Alert.alert(
                      "Generating PDF",
                      `Report from ${range.start.toDateString()} to ${range.end.toDateString()}`,
                    );
                    handleExport();
                  }}
                  className="items-center"
                >
                  <View className="bg-red-50 w-10 h-10 rounded-full items-center justify-center mb-1">
                    <Ionicons name="document" size={18} color="#dc2626" />
                  </View>
                  <Text className="text-[10px] font-bold text-slate-600">
                    PDF Report
                  </Text>
                </Pressable>
                <View className="w-px bg-slate-100" />
                <Pressable
                  onPress={() => {
                    generateSaccoExcel(
                      "Savings Ledger Audit",
                      filteredTransactions,
                      SAVINGS_LEDGER,
                    );
                  }}
                  className="items-center"
                >
                  <View className="bg-green-50 w-10 h-10 rounded-full items-center justify-center mb-1">
                    <Ionicons name="grid" size={18} color="#16a34a" />
                  </View>
                  <Text className="text-[10px] font-bold text-slate-600">
                    Excel Sheet
                  </Text>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {/* 3. THE PICKER HANDLER */}
        {showDatePicker && (
          <DateTimePicker
            value={activePicker === "start" ? range.start : range.end}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setRange((prev) => ({
                  ...prev,
                  [activePicker]: date,
                }));
                setIsFilterActive(true);
              }
            }}
          />
        )}

        {/* --- 3. FILTER TABS --- */}
        <View className="flex-row mb-4 p-1 rounded-lg self-start">
          {["all", "deposit", "withdrawal"].map((t) => (
            <Pressable
              key={t}
              onPress={() => setFilterType(t)}
              className={`px-4 py-1.5 mr-2 rounded-full border ${
                filterType === t
                  ? "bg-[#07193f] border-[#07193f]"
                  : "bg-white border-slate-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filterType === t ? "text-white" : "text-slate-600"
                }`}
              >
                {t.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="pb-20">
          {/* --- 4. TRANSACTION LEDGER LIST --- */}
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pl-1">
            Recent Activity
          </Text>

          {filteredTransactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} formatMoney={formatMoney} />
          ))}

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <View className="items-center py-10 opacity-50">
              <Ionicons name="file-tray-outline" size={40} color="#94a3b8" />
              <Text className="text-slate-400 text-xs font-bold mt-2">
                No transactions found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
