import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTransactionProofUrl } from "../../../services/member/getTransactionProofUrl";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateFull } from "../../../utils/formatDateFull";
import { ConfirmationModal } from "./ConfirmationModal";

export const RequestDetailModal = ({
  selectedRequest,
  setSelectedRequest,
  isProcessing,
  handleAction,
  getMethodIcon,
}) => {
  const { theme, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const [proofUrl, setProofUrl] = useState(null);
  const [loadingProof, setLoadingProof] = useState(false);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProof() {
      if (!selectedRequest?.proof_url) return;

      try {
        setLoadingProof(true);
        const url = await getTransactionProofUrl(selectedRequest.proof_url);
        if (mounted) setProofUrl(url);
      } catch (err) {
        console.error("Failed to load proof:", err);
        if (mounted) setProofUrl(null);
      } finally {
        if (mounted) setLoadingProof(false);
      }
    }

    loadProof();

    return () => {
      mounted = false;
    };
  }, [selectedRequest?.proof_url]);

  if (!selectedRequest) return null;

  const req = selectedRequest;
  const isCredit = req.direction === "Credit";
  const cleanText = (text) => text?.replace(/_/g, " ") || "N/A";

  // --- RENDER ---
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={!!selectedRequest}
      onRequestClose={() => setSelectedRequest(null)}
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <StatusBar
          barStyle={mode === "dark" ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />

        {/* 2. HEADER */}
        <View
          style={{
            paddingTop: Platform.OS === "android" ? insets.top + 10 : 20,
          }}
          className="px-6 pb-4 bg-transparent flex-row items-center justify-between z-10"
        >
          <Pressable
            onPress={() => setSelectedRequest(null)}
            style={({ pressed }) => ({
              backgroundColor: theme.card,
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
            className="w-10 h-10 items-center justify-center rounded-full shadow-sm"
          >
            <Ionicons name="close" size={20} color={theme.text} />
          </Pressable>

          <Text
            style={{ color: theme.gray500 }}
            className="font-bold text-xs uppercase tracking-widest"
          >
            Transaction Request Details
          </Text>

          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 120 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* 3. HERO AMOUNT SECTION */}
          <View className="items-center mt-2 mb-8">
            <View
              style={{
                backgroundColor: isCredit
                  ? theme.emerald + "15"
                  : theme.rose + "15",
              }}
              className="px-4 py-1.5 rounded-full mb-4"
            >
              <Text
                style={{ color: isCredit ? theme.emerald : theme.rose }}
                className="text-[10px] font-black uppercase tracking-widest"
              >
                {req.direction} Request
              </Text>
            </View>

            <Text
              style={{ color: theme.text }}
              className="text-5xl font-black tracking-tighter"
            >
              {formatCurrency(req.amount)}
            </Text>
          </View>

          {/* 4. MEMBER INFO CARD */}
          <View
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
            className="p-4 rounded-[24px] border mb-6 flex-row items-center"
          >
            <View
              style={{ backgroundColor: theme.primary + "15" }}
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
            >
              <Text
                style={{ color: theme.primary }}
                className="font-bold text-lg"
              >
                {String(req.userName || "U").charAt(0)}
              </Text>
            </View>
            <View>
              <Text
                style={{ color: theme.text }}
                className="font-bold text-base"
              >
                {req.userName || "Unknown Member"}
              </Text>
              <Text style={{ color: theme.gray500 }} className="text-xs mt-0.5">
                ID: {req.membership_no || "N/A"}
              </Text>
            </View>
            {/* Status Badge */}
            <View className="ml-auto">
              {req.status === "Pending" && (
                <Ionicons name="time" size={20} color={theme.orange} />
              )}
            </View>
          </View>

          {/* 5. DETAILS GRID */}
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase mb-3 ml-2 tracking-widest"
          >
            Metadata
          </Text>
          <View className="flex-row flex-wrap justify-between gap-y-3 mb-8">
            <DetailBox
              icon="swap-horizontal"
              label="Type"
              value={cleanText(req.transaction_type)}
              theme={theme}
            />
            <DetailBox
              icon={getMethodIcon(req.payment_method)}
              label="Method"
              value={cleanText(req.payment_method)}
              theme={theme}
            />
            <DetailBox
              icon="calendar-outline"
              label="Date"
              value={req.created_at ? formatDateFull(req.created_at) : "N/A"}
              theme={theme}
            />
            <DetailBox
              icon="barcode-outline"
              label="Reference"
              value={req.external_reference || "System Generated"}
              theme={theme}
            />
          </View>

          {/* 6. PROOF SECTION */}
          {req.notes && (
            <View
              style={{ backgroundColor: theme.orange + "10" }}
              className="p-4 rounded-2xl mb-6"
            >
              <Text
                style={{ color: theme.orange }}
                className="text-[10px] font-bold uppercase mb-1"
              >
                User Note
              </Text>
              <Text style={{ color: theme.text }} className="text-sm italic">
                {req.notes}
              </Text>
            </View>
          )}

          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase mb-3 ml-2 tracking-widest"
          >
            Verification
          </Text>
          <View
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
            className="rounded-[24px] border overflow-hidden min-h-[200px]"
          >
            {loadingProof ? (
              <View className="h-48 items-center justify-center">
                <ActivityIndicator color={theme.primary} />
              </View>
            ) : proofUrl ? (
              <Pressable className="relative h-64 w-full bg-black/5">
                <Image
                  source={{ uri: proofUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute bottom-2 right-2 bg-black/50 px-3 py-1 rounded-full">
                  <Text className="text-white text-[10px] font-bold">
                    Proof of Payment
                  </Text>
                </View>
              </Pressable>
            ) : (
              <View className="h-32 items-center justify-center opacity-50">
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color={theme.gray400}
                />
                <Text
                  style={{ color: theme.gray400 }}
                  className="text-xs mt-2 font-medium"
                >
                  No proof attached
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 7. FLOATING ACTION BAR */}
        <View
          className="absolute bottom-0 w-full px-6 pt-4 bg-white/90 border-t border-gray-100 flex-row gap-4 backdrop-blur-md"
          style={{
            paddingBottom: insets.bottom + 10,
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <Pressable
            onPress={() => setConfirmReject(true)}
            disabled={isProcessing}
            style={{
              backgroundColor: theme.rose + "15",
            }}
            className="flex-1 h-14 rounded-2xl items-center flex-row justify-center"
          >
            <Text style={{ color: theme.rose }} className="font-bold text-base">
              Reject
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setConfirmApprove(true)}
            disabled={isProcessing}
            style={{
              backgroundColor: theme.emerald,
              shadowColor: theme.emerald,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            className="flex-[2] h-14 rounded-2xl items-center flex-row justify-center"
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-lg mr-2">
                  Approve
                </Text>
                <Ionicons name="arrow-forward" size={18} color="white" />
              </>
            )}
          </Pressable>
        </View>

        {/* MODALS RETAINED */}
        <ConfirmationModal
          visible={confirmApprove}
          onClose={() => setConfirmApprove(false)}
          isProcessing={isProcessing}
          title="Approve Request"
          message="This will officially record the transaction and update the member's account balance."
          icon="checkmark-circle"
          confirmText="Approve"
          confirmColor={theme.emerald}
          onConfirm={() => {
            setConfirmApprove(false);
            handleAction("approve");
          }}
        />

        <ConfirmationModal
          visible={confirmReject}
          onClose={() => setConfirmReject(false)}
          isProcessing={isProcessing}
          title="Reject Request"
          message="Are you sure? This action cannot be undone."
          icon="close-circle"
          confirmText="Reject Transaction"
          confirmColor={theme.rose}
          requireReason
          onConfirm={(reason) => {
            setConfirmReject(false);
            handleAction("reject", reason);
          }}
        />
      </View>
    </Modal>
  );
};

// --- HELPER COMPONENT FOR GRID ---
const DetailBox = ({ icon, label, value, theme }) => (
  <View
    style={{ backgroundColor: theme.card, borderColor: theme.border }}
    className="w-[48%] p-4 rounded-2xl border mb-1"
  >
    <Ionicons
      name={icon}
      size={20}
      color={theme.gray400}
      style={{ marginBottom: 12 }}
    />
    <Text
      style={{ color: theme.gray400 }}
      className="text-[10px] font-bold uppercase"
    >
      {label}
    </Text>
    <Text
      style={{ color: theme.text }}
      className="font-bold text-sm mt-1"
      numberOfLines={1}
    >
      {value}
    </Text>
  </View>
);
