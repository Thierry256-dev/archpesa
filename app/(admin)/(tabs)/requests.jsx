import { useTheme } from "@/context/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar, Text, View } from "react-native";
import { RequestCard } from "../../../components/ui/adminUI/RequestCard";
import { RequestDetailModal } from "../../../components/ui/adminUI/RequestDetailModal";
import { RequestsHeader } from "../../../components/ui/adminUI/RequestsHeader";
import useAdminAllInfo from "../../../hooks/useAdminAllInfo";

export default function AdminRequestsPage() {
  const { theme } = useTheme();

  const { txRequests } = useAdminAllInfo();

  // State
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
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

  const handleAction = async (action, rejectionReason = null) => {
    if (!selectedRequest) return;

    const requestId = selectedRequest.id;
    setIsProcessing(true);

    try {
      if (action === "approve") {
        const { error } = await supabase.rpc("approve_transaction_request", {
          p_request_id: requestId,
        });

        if (error) throw error;
      }

      if (action === "reject") {
        if (!rejectionReason || rejectionReason.trim().length < 3) {
          throw new Error("Rejection reason is required");
        }

        const { error } = await supabase.rpc("reject_transaction_request", {
          p_request_id: requestId,
          p_rejection_reason: rejectionReason.trim(),
        });

        if (error) throw error;
      }

      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setSelectedRequest(null);
    } catch (error) {
      console.error(`Failed to ${action} transaction`, error);
      alert(error.message || "Action failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
    <View
      style={{ backgroundColor: theme.surface }}
      className="flex-1 w-full"
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
    </View>
  );
}
