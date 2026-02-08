import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RequestCard } from "../../../components/ui/adminUI/RequestCard";
import { RequestDetailModal } from "../../../components/ui/adminUI/RequestDetailModal";
import { RequestsHeader } from "../../../components/ui/adminUI/RequestsHeader";
import useAdminAllInfo from "../../../hooks/useAdminAllInfo";

export default function AdminRequestsPage() {
  const { theme } = useTheme();

  const { txRequests } = useAdminAllInfo();

  // State
  const [requests, setRequests] = useState(txRequests);
  const [selectedRequest, setSelectedRequest] = useState(null); // Controls Modal
  const [filterType, setFilterType] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);

  // Computed
  const pendingCount = requests.length;

  const filteredRequests = useMemo(() => {
    if (filterType === "All") return requests;

    return requests.filter((r) => {
      switch (filterType) {
        case "Deposits":
          return r.direction === "Credit";

        case "Withdrawals":
          return r.direction === "Debit";

        case "Loans":
          return r.transaction_type?.includes("Loan");

        default:
          return true;
      }
    });
  }, [requests, filterType]);

  // --- ACTIONS ---

  const handleAction = (action) => {
    const requestId = selectedRequest?.id;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      setSelectedRequest(null);

      if (requestId) {
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
      }

      if (action === "approve") {
        console.log("Transaction Approved & Ledger Updated");
      }
    }, 1000);
  };

  useEffect(() => {
    setRequests(txRequests || []);
  }, [txRequests]);

  const getStatusColor = (direction) => {
    switch (direction) {
      case "Credit":
        return theme.emerald;
      case "Debit":
        return theme.rose;
      default:
        return theme.gray500;
    }
  };

  const getMethodIcon = (method) => {
    const m = String(method || "");

    if (m.includes("MoMo")) return "phone-portrait-outline";
    if (m.includes("Bank")) return "business-outline";
    if (m.includes("Cash")) return "cash-outline";

    return "wallet-outline";
  };

  // --- RENDERERS ---

  const renderHeader = () => (
    <RequestsHeader
      theme={theme}
      pendingCount={pendingCount}
      filterType={filterType}
      setFilterType={setFilterType}
    />
  );

  const renderRequestCard = ({ item }) => (
    <RequestCard
      item={item}
      theme={theme}
      getStatusColor={getStatusColor}
      setSelectedRequest={setSelectedRequest}
    />
  );

  // --- DETAIL MODAL (THE DECISION ROOM) ---
  const renderDetailModal = () => (
    <RequestDetailModal
      selectedRequest={selectedRequest}
      setSelectedRequest={setSelectedRequest}
      theme={theme}
      isProcessing={isProcessing}
      handleAction={handleAction}
      getMethodIcon={getMethodIcon}
    />
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.surface }}
      className="flex-1"
      edges={["top"]}
    >
      <StatusBar barStyle="light-content" />
      {renderHeader()}

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestCard}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20 opacity-50">
            <Ionicons
              name="checkmark-done-circle"
              size={60}
              color={theme.gray400}
            />
            <Text className="text-gray-500 font-bold mt-4">All caught up!</Text>
          </View>
        }
      />

      {renderDetailModal()}
    </SafeAreaView>
  );
}
