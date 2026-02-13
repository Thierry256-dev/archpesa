import {
  generateSaccoExcel,
  generateSaccoLedger,
} from "@/utils/reports/generateSaccoDocument";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActionButton,
  FilterTab,
  TransactionRow,
} from "../../../components/ui/adminUI/adminLedgerSubComponents";
import {
  accountTypes,
  datePresets,
  filterTypes,
} from "../../../constants/admin/configTypes";
import { useFilteredTransactions } from "../../../hooks/adminHooks/useFilteredTransactions";
import useAdminAllInfo from "../../../hooks/useAdminAllInfo";

export default function LedgerPage() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [totalsFilter, setTotalsFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [range, setRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  const { transactions, members } = useAdminAllInfo();

  const { ledgerTotals, enrichedTransactions } = useFilteredTransactions({
    transactions,
    members,
    filterType,
    totalsFilter,
    searchQuery,
    range,
    selectedPeriod,
  });

  //Handlers
  const formatMoney = (amount) => Number(amount).toLocaleString();

  const applyDatePreset = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    setRange({ start, end });
    setSelectedPeriod(months);
  };

  const handleResetRange = () => {
    setSelectedPeriod(null);
    setRange({
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(),
    });
  };

  // --- RENDER HELPERS ---
  const renderTransactionItem = useCallback(
    ({ item }) => <TransactionRow tx={item} formatMoney={formatMoney} />,
    [],
  );

  const ListHeader = () => (
    <View className="mb-2">
      {/* --- FINANCIAL DASHBOARD CARD --- */}
      <View
        className="bg-arch-blue p-6 rounded-[24px] shadow-lg shadow-blue-900/20 mb-6"
        style={{ zIndex: 100 }}
      >
        <View className="flex-row justify-between items-start mb-6 z-50">
          <View>
            <Text className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
              Net Position
            </Text>
            <Text className="text-white text-3xl font-black">
              <Text className="text-lg font-medium text-blue-300 mr-1">
                UGX{" "}
              </Text>
              {formatMoney(ledgerTotals.netAmount)}
            </Text>
          </View>

          {/* Dropdown Container */}
          <View className="relative w-28" style={{ zIndex: 200 }}>
            <Pressable
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex-row justify-between items-center bg-white/10 px-3 py-2 rounded-lg backdrop-blur-md border border-white/20"
            >
              <Text className="text-white text-xs font-bold uppercase">
                {totalsFilter}
              </Text>
              <Ionicons
                name={isDropdownOpen ? "arrow-up" : "arrow-down"}
                size={16}
                color="white"
              />
            </Pressable>

            {isDropdownOpen && (
              <View
                from={{ opacity: 0, scale: 0.9, translateY: -10 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, translateY: -10 }}
                transition={{ type: "timing", duration: 200 }}
                className="absolute top-11 right-0 left-0 bg-[#1e293b] rounded-lg shadow-xl overflow-hidden"
              >
                {accountTypes.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setTotalsFilter(item.type);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-3 border-b border-white/5 active:bg-blue-600"
                  >
                    <Text className="text-white text-xs">
                      {item.name.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Opening Balance Context */}
        <View className="mb-4">
          <Text className="text-blue-300/80 text-xs">
            Opening Balance: {formatMoney(ledgerTotals.openingBalance)}
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

          <View className="h-2 bg-slate-700 rounded-full flex-row overflow-hidden mb-2">
            <View
              style={{ width: `${ledgerTotals.depositPercent}%` }}
              className="bg-emerald-400 h-full"
            />
            <View className="flex-1 bg-rose-400 h-full" />
          </View>

          <View className="flex-row justify-between">
            <Text className="text-emerald-400 font-bold text-xs">
              +{formatMoney(ledgerTotals.totalDeposits)}
            </Text>
            <Text className="text-rose-400 font-bold text-xs">
              -{formatMoney(ledgerTotals.totalWithdraws)}
            </Text>
          </View>
        </View>
      </View>

      {/* --- CONTROLS --- */}
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-xl px-3 h-12 shadow-sm">
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            placeholder="Search Transaction ID..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-sm text-slate-800 font-medium"
            placeholderTextColor="#cbd5e1"
          />
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row">
          {filterTypes.map((item) => (
            <FilterTab
              key={item.type}
              label={item.name}
              type={item.type}
              isActive={filterType === item.type}
              onPress={setFilterType}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setShowExportOptions(!showExportOptions)}
          className={`w-10 h-10 rounded-full items-center justify-center border ${
            showExportOptions
              ? "bg-emerald-50 border-emerald-200"
              : "bg-white border-slate-200"
          }`}
        >
          <Ionicons
            name={showExportOptions ? "close" : "options"}
            size={20}
            color={showExportOptions ? "#10b981" : "#64748b"}
          />
        </TouchableOpacity>
      </View>

      {/* --- EXPORT PANEL --- */}
      <View>
        {showExportOptions && (
          <View
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 mb-6 shadow-sm overflow-hidden"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-slate-800">Date Range</Text>
              {selectedPeriod && (
                <Pressable onPress={handleResetRange}>
                  <Text className="text-rose-500 text-[10px] font-bold uppercase">
                    Reset
                  </Text>
                </Pressable>
              )}
            </View>

            <View className="flex-row gap-2 mb-6">
              {datePresets.map((preset) => (
                <Pressable
                  key={preset.value}
                  onPress={() => applyDatePreset(preset.value)}
                  className={`flex-1 py-2 rounded-lg border items-center justify-center ${
                    selectedPeriod === preset.value
                      ? "bg-slate-800 border-slate-800"
                      : "bg-slate-50 border-slate-200 active:bg-slate-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${selectedPeriod === preset.value ? "text-white" : "text-slate-600"}`}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row justify-around pt-4 border-t border-slate-50">
              <ActionButton
                icon="document-text"
                label="PDF Report"
                color="red"
                onPress={() =>
                  requestAnimationFrame(() =>
                    generateSaccoLedger(enrichedTransactions),
                  )
                }
              />
              <View className="h-8 w-px bg-slate-100" />
              <ActionButton
                icon="grid"
                label="Excel Sheet"
                color="green"
                onPress={() => generateSaccoExcel(enrichedTransactions)}
              />
            </View>
          </View>
        )}
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">
          Recent Activity
        </Text>
        <Text className="text-slate-400 text-[10px] font-bold  mb-2 px-1">
          {enrichedTransactions.length} entries
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] w-full max-w-md h-full md:h-[90vh] md:max-h-[850px]">
      {/* --- NAVIGATION HEADER --- */}
      <View className="px-6 py-4 bg-white border-b border-slate-100 flex-row justify-between items-center z-50">
        <View>
          <Text className="text-xl font-bold text-slate-900">
            Treasury Ledger
          </Text>
        </View>
        <Pressable className="bg-slate-100 p-2 rounded-full">
          <Ionicons name="wallet-outline" size={20} color="#64748b" />
        </Pressable>
      </View>

      <FlatList
        data={enrichedTransactions}
        keyExtractor={(item) => item.id || item.created_at}
        renderItem={renderTransactionItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View className="items-center py-20 opacity-50">
            <Ionicons name="documents-outline" size={64} color="#cbd5e1" />
            <Text className="text-slate-400 text-sm font-bold mt-4">
              No transactions found
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          paddingTop: 24,
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}
