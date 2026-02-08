import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTransactionProofUrl } from "../../../services/member/getTransactionProofUrl";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateFull } from "../../../utils/formatDateFull";

export const RequestDetailModal = ({
  selectedRequest,
  setSelectedRequest,
  theme,
  isProcessing,
  handleAction,
  getMethodIcon,
}) => {
  if (!selectedRequest) return null;

  const req = selectedRequest;
  const isCredit = req.direction === "Credit";

  const cleanText = (text) => text?.replace(/_/g, " ") || "N/A";

  const proofUrl = req.proof_url ? getTransactionProofUrl(req.proof_url) : null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={!!selectedRequest}
      onRequestClose={() => setSelectedRequest(null)}
    >
      <SafeAreaView
        style={{ backgroundColor: theme.surface }}
        className="flex-1 relative"
      >
        {/* 1. MODAL HEADER */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100 bg-white z-10">
          <Pressable
            onPress={() => setSelectedRequest(null)}
            className="w-10 h-10 items-center justify-center rounded-full bg-slate-50 border border-slate-100"
          >
            <Ionicons name="arrow-back" size={20} color={theme.gray900} />
          </Pressable>
          <Text className="font-bold text-lg text-slate-800">
            Transaction Details
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 2. MEMBER SUMMARY */}
          <View
            style={{ backgroundColor: theme.card }}
            className="p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex-row items-center"
          >
            <View className="w-12 h-12 rounded-full bg-slate-200 mr-3 items-center justify-center border border-slate-300">
              <Text className="font-bold text-slate-600 text-xl">
                {String(req.userName || "U").charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold text-lg text-slate-900">
                {req.userName || "Unknown Member"}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <View className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                  <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {req.membership_no || "NO ID"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. FINANCIAL SNAPSHOT CARD */}
          <View className="items-center py-6 bg-white rounded-3xl border border-slate-100 shadow-sm mb-6 relative overflow-hidden">
            {/* Background Decoration */}
            <View
              className={`absolute top-0 w-full h-2 ${isCredit ? "bg-emerald-500" : "bg-rose-500"}`}
            />

            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              Transaction Amount
            </Text>
            <Text
              style={{ color: isCredit ? theme.emerald : theme.rose }}
              className="text-4xl font-black mb-1"
            >
              {isCredit ? "+" : "-"}
              {formatCurrency(req.amount)}
              <Text className="text-lg text-slate-400 font-medium"> UGX</Text>
            </Text>
            <View
              className={`px-3 py-1 rounded-full mt-2 ${
                req.status === "Pending" ? "bg-amber-50" : "bg-slate-50"
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase ${
                  req.status === "Pending" ? "text-amber-600" : "text-slate-500"
                }`}
              >
                Status: {req.status}
              </Text>
            </View>
          </View>

          {/* 4. DETAILS GRID */}
          <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
            {/* Box A: Transaction Type */}
            <View className="w-[48%] bg-white p-4 rounded-2xl border border-slate-100">
              <Ionicons
                name="swap-horizontal"
                size={20}
                color={theme.primary}
                style={{ marginBottom: 8 }}
              />
              <Text className="text-slate-400 text-[10px] font-bold uppercase">
                Type
              </Text>
              <Text className="text-slate-800 font-bold text-sm mt-0.5">
                {cleanText(req.transaction_type)}
              </Text>
            </View>

            {/* Box B: Payment Method */}
            <View className="w-[48%] bg-white p-4 rounded-2xl border border-slate-100">
              <Ionicons
                name={getMethodIcon(req.payment_method)}
                size={20}
                color={theme.secondary}
                style={{ marginBottom: 8 }}
              />
              <Text className="text-slate-400 text-[10px] font-bold uppercase">
                Method
              </Text>
              <Text className="text-slate-800 font-bold text-sm mt-0.5">
                {cleanText(req.payment_method)}
              </Text>
            </View>

            {/* Box C: Date Time */}
            <View className="w-[48%] bg-white p-4 rounded-2xl border border-slate-100">
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.gray500}
                style={{ marginBottom: 8 }}
              />
              <Text className="text-slate-400 text-[10px] font-bold uppercase">
                Submitted
              </Text>
              <Text className="text-slate-800 font-bold text-xs mt-0.5 leading-4">
                {req.created_at ? formatDateFull(req.created_at) : "N/A"}
              </Text>
            </View>

            {/* Box D: Reference */}
            <View className="w-[48%] bg-white p-4 rounded-2xl border border-slate-100">
              <Ionicons
                name="barcode-outline"
                size={20}
                color={theme.gray500}
                style={{ marginBottom: 8 }}
              />
              <Text className="text-slate-400 text-[10px] font-bold uppercase">
                Reference
              </Text>
              <Text
                className="text-slate-800 font-bold text-xs mt-0.5 font-mono"
                numberOfLines={1}
              >
                {req.external_reference ? req.external_reference : "Internal"}
              </Text>
            </View>
          </View>

          {/* 5. NOTES */}
          {req.notes ? (
            <View className="mb-6 bg-amber-50 p-4 rounded-xl border border-amber-100">
              <Text className="text-amber-800 font-bold text-xs uppercase mb-1">
                User Notes
              </Text>
              <Text className="text-amber-900 text-sm italic">{req.notes}</Text>
            </View>
          ) : null}

          {/* 6. PROOF VIEWER */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold text-slate-500 uppercase ml-1">
                Proof Verification
              </Text>
              {req.proof_url && (
                <View className="bg-blue-50 px-2 py-1 rounded">
                  <Text className="text-[10px] text-blue-600 font-bold">
                    Image Attached
                  </Text>
                </View>
              )}
            </View>

            {proofUrl ? (
              <View className="h-72 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
                <Image
                  source={{ uri: proofUrl }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
                <View className="absolute bottom-0 w-full bg-black/50 p-3 flex-row items-center justify-center">
                  <Ionicons name="expand" color="white" size={14} />
                  <Text className="text-white text-xs font-bold ml-2">
                    Tap to Zoom
                  </Text>
                </View>
              </View>
            ) : (
              <View className="bg-slate-50 p-6 rounded-2xl flex-row items-center justify-center border border-dashed border-slate-300">
                <Ionicons
                  name="image-outline"
                  size={30}
                  color={theme.gray400}
                />
                <Text className="text-slate-400 text-sm ml-3 font-medium">
                  No proof image provided
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 7. ACTION BAR (Sticky Bottom) */}
        <View
          className="absolute bottom-0 w-full bg-white px-6 pt-4 pb-8 border-t border-slate-100 shadow-2xl flex-row gap-4"
          style={{ paddingBottom: 30 }}
        >
          <Pressable
            onPress={() => handleAction("reject")}
            disabled={isProcessing}
            className="flex-1 bg-rose-50 border border-rose-100 h-14 rounded-2xl items-center flex-row justify-center active:bg-rose-100"
          >
            <Ionicons
              name="close-circle-outline"
              size={22}
              color={theme.rose}
            />
            <Text className="text-rose-600 font-bold ml-2 text-base">
              Reject
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleAction("approve")}
            disabled={isProcessing}
            className="flex-[2] bg-emerald-500 h-14 rounded-2xl items-center flex-row justify-center shadow-lg shadow-emerald-200 active:bg-emerald-600"
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="white" />
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
