import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- MOCK DATA ---
const MOCK_REQUESTS = [
  {
    id: "TRX-8821",
    user: {
      name: "John Doe",
      id: "M-045",
      status: "Active",
      reliability: "High",
    },
    type: "deposit",
    amount: 50000,
    method: "MTN MoMo",
    timestamp: "10:42 AM",
    date: "2024-02-06",
    reference: "MTN123XYZ",
    proof_url: "https://via.placeholder.com/400x600", // Placeholder image
    stats: { approved: 12, rejected: 0, last_seen: "3 days ago" },
    system_check: { match: true, detected_amount: 50000 },
  },
  {
    id: "TRX-8822",
    user: {
      name: "Sarah Nakintu",
      id: "M-092",
      status: "Active",
      reliability: "Medium",
    },
    type: "withdraw",
    amount: 250000,
    method: "Bank Transfer",
    timestamp: "09:15 AM",
    date: "2024-02-06",
    reference: "REQ-002",
    proof_url: null, // Withdrawals might not have proof upload, just a request
    stats: { approved: 5, rejected: 1, last_seen: "1 week ago" },
    system_check: { match: true, available_balance: 1200000 },
  },
  {
    id: "TRX-8823",
    user: {
      name: "Robert Fox",
      id: "M-110",
      status: "Suspended",
      reliability: "Low",
    },
    type: "loan_repay",
    amount: 15000,
    method: "Cash",
    timestamp: "Yesterday",
    date: "2024-02-05",
    reference: "CASH-REC-99",
    proof_url: "https://via.placeholder.com/400",
    stats: { approved: 2, rejected: 3, last_seen: "1 month ago" },
    system_check: { match: false, detected_amount: 10000 }, // FRAUD ALERT
  },
];

export default function AdminRequestsPage() {
  const { theme } = useTheme();

  // State
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null); // Controls Modal
  const [filterType, setFilterType] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);

  // Computed
  const pendingCount = requests.length;

  // --- ACTIONS ---

  const handleAction = (action) => {
    // 1. UI Feedback
    setIsProcessing(true);

    // 2. Simulate API Call
    setTimeout(() => {
      setIsProcessing(false);

      // 3. Close Modal & Remove Item
      setSelectedRequest(null);
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));

      // 4. Toast/Feedback (Using Alert for simplicity, ideally use a Toast component)
      if (action === "approve") {
        // In a real app, show a non-blocking toast here
        console.log("Transaction Approved & Ledger Updated");
      }
    }, 1000);
  };

  const getStatusColor = (type) => {
    switch (type) {
      case "deposit":
        return theme.emerald;
      case "withdraw":
        return theme.rose;
      case "loan_repay":
        return theme.blue;
      default:
        return theme.gray500;
    }
  };

  // --- RENDERERS ---

  const renderHeader = () => (
    <View
      style={{ backgroundColor: theme.primary }}
      className="px-6 pt-6 pb-8 rounded-b-3xl shadow-lg z-10"
    >
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-white text-3xl font-black tracking-tight">
            Requests
          </Text>
          <Text className="text-blue-200 text-xs font-medium mt-1">
            Review and approve member submissions
          </Text>
        </View>
        <View className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
          <Text className="text-white font-black text-xl text-center">
            {pendingCount}
          </Text>
          <Text className="text-blue-100 text-[10px] uppercase font-bold text-center">
            Pending
          </Text>
        </View>
      </View>

      {/* FILTER BAR */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mt-2"
      >
        {["All", "Deposits", "Withdrawals", "Loans"].map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilterType(f)}
            style={{
              backgroundColor:
                filterType === f ? "white" : "rgba(255,255,255,0.1)",
            }}
            className="px-4 py-2 rounded-full mr-2"
          >
            <Text
              style={{
                color: filterType === f ? theme.primary : "white",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderRequestCard = ({ item }) => (
    <Pressable
      onPress={() => setSelectedRequest(item)}
      style={{
        backgroundColor: theme.card,
        shadowColor: theme.gray300,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
      className="mx-6 mb-3 p-4 rounded-2xl flex-row items-center border border-slate-100"
    >
      {/* ICON BOX */}
      <View
        style={{ backgroundColor: getStatusColor(item.type) + "15" }}
        className="w-12 h-12 rounded-xl items-center justify-center mr-4"
      >
        <Ionicons
          name={
            item.type === "deposit"
              ? "wallet"
              : item.type === "withdraw"
                ? "arrow-up-circle"
                : "document-text"
          }
          size={22}
          color={getStatusColor(item.type)}
        />
      </View>

      {/* DETAILS */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text
            style={{ color: theme.gray900 }}
            className="font-bold text-base"
          >
            {item.user.name}
          </Text>
          <Text
            style={{ color: getStatusColor(item.type) }}
            className="font-bold text-sm"
          >
            {item.type === "withdraw" ? "-" : "+"}
            {item.amount.toLocaleString()}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            style={{ color: theme.gray500 }}
            className="text-xs font-medium"
          >
            {item.method} • {item.timestamp}
          </Text>
          {/* UNREAD DOT */}
          <View
            style={{ backgroundColor: theme.primary }}
            className="w-2 h-2 rounded-full"
          />
        </View>
      </View>
    </Pressable>
  );

  // --- DETAIL MODAL (THE DECISION ROOM) ---
  const renderDetailModal = () => {
    if (!selectedRequest) return null;
    const req = selectedRequest;
    const isMismatch = !req.system_check.match;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={!!selectedRequest}
      >
        <SafeAreaView
          style={{ backgroundColor: theme.surface }}
          className="flex-1 relative"
        >
          {/* MODAL HEADER */}
          <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100 bg-white">
            <Pressable
              onPress={() => setSelectedRequest(null)}
              className="p-2 -ml-2 rounded-full bg-gray-50"
            >
              <Ionicons name="close" size={24} color={theme.gray900} />
            </Pressable>
            <Text className="font-bold text-lg text-slate-800">
              Review Request
            </Text>
            <View className="w-10" />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
          >
            {/* 1. MEMBER SUMMARY CARD */}
            <View
              style={{ backgroundColor: theme.card }}
              className="p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex-row"
            >
              <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 items-center justify-center">
                <Text className="font-bold text-gray-500 text-lg">
                  {req.user.name.charAt(0)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-slate-900">
                  {req.user.name}
                </Text>
                <Text className="text-xs text-slate-500 font-bold uppercase">
                  ID: {req.user.id} • {req.user.status}
                </Text>

                {/* Member Stats Mini-Dashboard */}
                <View className="flex-row mt-3 gap-3">
                  <View className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                    <Text className="text-[10px] font-bold text-emerald-700">
                      ✓ {req.stats.approved} Approved
                    </Text>
                  </View>
                  <View className="bg-rose-50 px-2 py-1 rounded border border-rose-100">
                    <Text className="text-[10px] font-bold text-rose-700">
                      ✕ {req.stats.rejected} Rejected
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 2. TRANSACTION COMPARISON (The Trust Anchor) */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-3 ml-1">
              Transaction Data
            </Text>
            <View
              style={{ backgroundColor: theme.card }}
              className="rounded-2xl border border-slate-100 overflow-hidden mb-6"
            >
              {/* Row 1: Amount */}
              <View className="flex-row border-b border-slate-100">
                <View className="flex-1 p-4 border-r border-slate-100">
                  <Text className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Declared
                  </Text>
                  <Text className="text-lg font-black text-slate-800">
                    {req.amount.toLocaleString()}
                  </Text>
                </View>
                <View
                  className={`flex-1 p-4 ${isMismatch ? "bg-rose-50" : "bg-emerald-50"}`}
                >
                  <View className="flex-row justify-between">
                    <Text
                      className={`text-[10px] uppercase font-bold mb-1 ${isMismatch ? "text-rose-500" : "text-emerald-600"}`}
                    >
                      {req.type === "withdraw" ? "Available Bal" : "Detected"}
                    </Text>
                    {isMismatch && (
                      <Ionicons
                        name="alert-circle"
                        size={14}
                        color={theme.rose}
                      />
                    )}
                  </View>
                  <Text
                    className={`text-lg font-black ${isMismatch ? "text-rose-700" : "text-emerald-700"}`}
                  >
                    {(
                      req.system_check.detected_amount ||
                      req.system_check.available_balance ||
                      0
                    ).toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Row 2: Method & Ref */}
              <View className="p-4 bg-white">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-slate-500 font-medium">
                    Method
                  </Text>
                  <Text className="text-xs text-slate-900 font-bold">
                    {req.method}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-500 font-medium">
                    Reference
                  </Text>
                  <Text className="text-xs text-slate-900 font-bold tracking-wider font-mono">
                    {req.reference}
                  </Text>
                </View>
              </View>
            </View>

            {/* 3. PROOF VIEWER */}
            {req.proof_url ? (
              <View>
                <Text className="text-xs font-bold text-slate-400 uppercase mb-3 ml-1">
                  Proof of Payment
                </Text>
                <View className="h-64 bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 relative">
                  <Image
                    source={{ uri: req.proof_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <Pressable className="absolute bottom-3 right-3 bg-black/60 px-3 py-1.5 rounded-lg flex-row items-center">
                    <Ionicons name="expand" size={12} color="white" />
                    <Text className="text-white text-xs font-bold ml-1">
                      Zoom
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="bg-blue-50 p-4 rounded-xl flex-row items-center">
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={theme.primary}
                />
                <Text className="text-slate-600 text-xs ml-2 flex-1">
                  No proof image required for this transaction type. Please
                  verify system balance.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* 4. ACTION BAR (Sticky Bottom) */}
          <View className="absolute bottom-0 w-full bg-white px-6 pt-4 pb-8 border-t border-slate-100 shadow-2xl flex-row gap-4">
            <Pressable
              onPress={() => handleAction("reject")}
              disabled={isProcessing}
              className="flex-1 bg-rose-50 border border-rose-100 py-4 rounded-xl items-center flex-row justify-center"
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={theme.rose}
              />
              <Text className="text-rose-600 font-bold ml-2">Reject</Text>
            </Pressable>

            <Pressable
              onPress={() => handleAction("approve")}
              disabled={isProcessing}
              className="flex-[2] bg-emerald-500 py-4 rounded-xl items-center flex-row justify-center shadow-lg shadow-emerald-200"
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text className="text-white font-bold ml-2 text-lg">
                    Approve
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.surface }}
      className="flex-1"
      edges={["top"]}
    >
      <StatusBar barStyle="light-content" />
      {renderHeader()}

      <FlatList
        data={requests}
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
