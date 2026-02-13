import { useTheme } from "@/context/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

// --- Hooks & Services ---
import { directionMap } from "../../../constants/transactionConfigs";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";
import { buildTransactionPayload } from "../../../services/member/buildTransactionPayload";
import { createTransactionRequest } from "../../../services/member/createTransactionRequest";
import { uploadTransactionProof } from "../../../services/member/uploadTransactionProof";

// --- Components ---
import TransactionForm from "@/components/forms/TransactionForm";
import {
  PendingTransactionDetail,
  TransactHeader,
  TransactionSuccess,
  TransactionTypeSelector,
} from "@/components/ui/memberUI/transactSubComponents";

export default function TransactPage() {
  const { theme } = useTheme();

  const { profile, accounts, transactionRequests, loans } = useMemberAllInfo();

  const [step, setStep] = useState("select"); // 'select' | 'form' | 'success'
  const [txType, setTxType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectType = (typeId) => {
    setTxType(typeId);
    setStep("form");
  };

  const handleChangeStep = (newStep) => {
    setStep(newStep);
  };

  const handleReset = () => {
    setStep("select");
    setTxType(null);
  };

  const handleSubmit = async (formData) => {
    if (!profile) return;
    setIsSubmitting(true);

    try {
      const payload = buildTransactionPayload({
        txType,
        profile,
        accounts,
        loans,
        formData,
        directionMap,
      });

      const request = await createTransactionRequest(payload);

      if (txType !== "withdraw" && formData.proofImage) {
        const proofPath = await uploadTransactionProof({
          uri: formData.proofImage,
          userId: profile.auth_user_id,
        });

        await supabase
          .from("transaction_requests")
          .update({ proof_url: proofPath })
          .eq("id", request.id);
      }

      setStep("success");
    } catch (err) {
      console.error(err);
      toast?.error?.(err.message ?? "Failed to submit transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = insets.top + 120;

  return (
    <View
      style={{ backgroundColor: theme.surface }}
      className="flex-1 w-full max-w-md h-full md:h-[90vh] md:max-h-[850px]"
    >
      {/* Header  */}
      {step !== "success" && <TransactHeader />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 "
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: step === "success" ? 20 : HEADER_HEIGHT,
          }}
        >
          {/* Main Content Area */}
          <View className="px-6">
            {step === "select" && (
              <>
                <TransactionTypeSelector onSelectType={handleSelectType} />

                <View className="mt-8">
                  {/* PENDING SECTION HEADER */}
                  <View className="flex-row items-center justify-between mb-4 px-1">
                    <View className="flex-row items-center">
                      <Text
                        style={{ color: theme.text }}
                        className="text-lg font-black tracking-tight"
                      >
                        Pending Approval
                      </Text>
                      {transactionRequests?.length > 0 && (
                        <View
                          style={{ backgroundColor: theme.orange }}
                          className="ml-2 px-2 py-0.5 rounded-full"
                        >
                          <Text className="text-white text-[10px] font-bold">
                            {transactionRequests.length}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Pressable hitSlop={10}>
                      <Text
                        style={{ color: theme.gray400 }}
                        className="text-xs font-bold uppercase tracking-widest"
                      >
                        History
                      </Text>
                    </Pressable>
                  </View>

                  {/* PENDING LIST */}
                  {transactionRequests?.length > 0 ? (
                    <View>
                      {transactionRequests.map((item, index) => (
                        <PendingTransactionDetail
                          key={item.id || index}
                          item={item}
                        />
                      ))}
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        borderStyle: "dashed",
                      }}
                      className="p-8 rounded-[24px] border items-center justify-center"
                    >
                      <View
                        style={{ backgroundColor: theme.gray100 }}
                        className="w-12 h-12 rounded-full items-center justify-center mb-3"
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={32}
                          color={theme.gray400}
                        />
                      </View>
                      <Text
                        style={{ color: theme.gray500 }}
                        className="font-bold text-sm"
                      >
                        All caught up!
                      </Text>
                      <Text
                        style={{ color: theme.gray400 }}
                        className="text-[11px] text-center mt-1 px-4"
                      >
                        No transactions are currently awaiting approval.
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            {step === "form" && (
              <TransactionForm
                txType={txType}
                onChangeStep={handleChangeStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {step === "success" && <TransactionSuccess onReset={handleReset} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
