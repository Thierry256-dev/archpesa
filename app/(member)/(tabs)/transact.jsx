import { useTheme } from "@/context/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  toast,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ACCOUNTS,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
  directionMap,
} from "../../../constants/transactionConfigs";
import { useMemberAllInfo } from "../../../hooks/useMemberAllInfo";
import { createTransactionRequest } from "./member/createTransactionRequest";
import { uploadTransactionProof } from "./member/uploadTransactionProof";

export default function TransactPage() {
  const { theme, mode } = useTheme();

  const { profile } = useMemberAllInfo();

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState("select"); // 'select' | 'form' | 'success'
  const [txType, setTxType] = useState(null);

  // Form State
  const [targetAccount, setTargetAccount] = useState("Savings");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MTN_MoMo");
  const [proofImage, setProofImage] = useState(null);
  const [notes, setNotes] = useState("");

  // OCR & Validation State
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [isDeclared, setIsDeclared] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Helpers
  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    return await response.blob();
  };

  // --- HANDLERS ---

  const handleSelectType = (typeId) => {
    setTxType(typeId);
    setStep("form");
    // Reset form defaults based on type
    if (typeId === "withdraw") setTargetAccount("savings");
  };

  const pickImage = async () => {
    // 1. Request Permission (Mocking successful permission for brevity)
    // 2. Launch Picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProofImage(result.assets[0].uri);
      simulateOCR();
    }
  };

  const simulateOCR = () => {
    setIsOCRProcessing(true);
    // Mocking an AI scan delay
    setTimeout(() => {
      setOcrData({
        amount: "50,000",
        date: "06 Feb 2026",
        ref: "MTN88299X",
      });
      setIsOCRProcessing(false);
    }, 2000);
  };

  const selectedAccount = ACCOUNTS.find((acc) => acc.id === targetAccount);

  if (!selectedAccount) {
    throw new Error("Invalid account selected");
  }

  const handleSubmit = async () => {
    if (!profile) return;

    setIsSubmitting(true);

    try {
      const numericAmount = Number(amount.replace(/,/g, ""));
      const direction = directionMap[txType];

      if (!direction || numericAmount <= 0) {
        throw new Error("Invalid transaction data");
      }

      //  Create transaction request
      const request = await createTransactionRequest({
        user_id: profile.auth_user_id,
        transaction_type: txType,
        direction,
        account: targetAccount,
        amount: numericAmount,
        payment_method: paymentMethod,
        notes,
      });

      // Upload proof
      if (proofImage) {
        const proofBlob = await uriToBlob(proofImage);

        const proofPath = await uploadTransactionProof({
          file: proofBlob,
          userId: profile.auth_id,
          requestId: request.id,
        });

        //  Attach proof to request
        await supabase
          .from("transaction_requests")
          .update({ proof_url: proofPath })
          .eq("id", request.id);
      }

      setStep("success");
    } catch (err) {
      console.error(err);
      toast?.error?.("Failed to submit transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep("select");
    setTxType(null);
    setAmount("");
    setProofImage(null);
    setOcrData(null);
    setIsDeclared(false);
  };

  // --- RENDER HELPERS ---

  // 1. HEADER
  const renderHeader = () => (
    <View className="mb-6">
      <Text style={{ color: theme.primary }} className="text-3xl font-bold">
        Transact
      </Text>
      <Text style={{ color: theme.gray500 }} className="text-sm mt-1">
        Submit a deposit, withdrawal, or loan repayment request.
      </Text>
    </View>
  );

  // 2. TYPE SELECTOR
  const renderTypeSelector = () => (
    <View>
      <Text style={{ color: theme.gray800 }} className="font-bold mb-4 text-lg">
        What would you like to do?
      </Text>
      {TRANSACTION_TYPES.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => handleSelectType(item.id)}
          style={({ pressed }) => ({
            backgroundColor: theme.card,
            borderColor: pressed ? theme.primary : theme.border,
            borderWidth: 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
          })}
          className="flex-row items-center p-4 mb-3 rounded-2xl"
        >
          <View
            style={{ backgroundColor: theme.primary + "15" }}
            className="w-12 h-12 rounded-full items-center justify-center mr-4"
          >
            <Ionicons name={item.icon} size={22} color={theme.primary} />
          </View>

          <View className="flex-1 justify-center">
            <Text
              style={{ color: theme.text }}
              className="font-bold text-[15px] mb-1"
            >
              {item.title}
            </Text>
            <Text
              style={{ color: theme.gray500 }}
              className="text-xs font-medium leading-4 pr-2"
              numberOfLines={2}
            >
              {item.desc}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color={theme.gray300} />
        </Pressable>
      ))}
    </View>
  );

  // 3. DYNAMIC FORM
  const renderForm = () => {
    const isDeposit = txType === "deposit";
    const isRepay = txType === "repay";

    return (
      <View>
        {/* Selected Context */}
        <View
          style={{ backgroundColor: theme.primary + "10" }}
          className="flex-row items-center p-3 rounded-xl mb-6 border border-blue-100"
        >
          <Ionicons name="information-circle" size={20} color={theme.primary} />
          <Text style={{ color: theme.primary }} className="font-bold ml-2">
            {TRANSACTION_TYPES.find((t) => t.id === txType)?.title}
          </Text>
          <Pressable onPress={() => setStep("select")} className="ml-auto">
            <Text
              style={{ color: theme.gray500 }}
              className="text-xs font-bold underline"
            >
              Change
            </Text>
          </Pressable>
        </View>

        {/* FIELD: Target Account */}
        <View className="mb-8">
          <Text
            style={{ color: theme.gray700 }}
            className="text-xs font-bold uppercase mb-3 ml-1"
          >
            {isDeposit
              ? "Deposit To"
              : isRepay
                ? "Repay Loan"
                : "Withdraw From"}
          </Text>
          <View
            style={{ backgroundColor: theme.card }}
            className="rounded-2xl overflow-hidden border border-slate-100"
          >
            {ACCOUNTS.map((acc, index) => {
              // Filter logic could go here (e.g., hide Shares if withdrawing)
              const isActive = targetAccount === acc.id;
              return (
                <Pressable
                  key={acc.id}
                  onPress={() => setTargetAccount(acc.id)}
                  style={{
                    borderBottomWidth: index !== ACCOUNTS.length - 1 ? 1 : 0,
                    borderColor: theme.gray100,
                  }}
                  className="flex-row items-center p-4 bg-white"
                >
                  <View
                    style={{
                      borderColor: isActive ? theme.primary : theme.gray300,
                      borderWidth: isActive ? 5 : 2,
                    }}
                    className="w-5 h-5 rounded-full mr-3 items-center justify-center"
                  />
                  <Text
                    style={{
                      color: isActive ? theme.gray900 : theme.gray500,
                      fontWeight: isActive ? "700" : "400",
                    }}
                  >
                    {acc.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* FIELD: Amount */}
        <View className="mb-8">
          <Text
            style={{ color: theme.gray700 }}
            className="text-xs font-bold uppercase mb-3 ml-1"
          >
            Amount (UGX)
          </Text>
          <View
            style={{ backgroundColor: theme.card, borderColor: theme.primary }}
            className="flex-row items-center px-4 py-4 rounded-2xl border-2 shadow-sm"
          >
            <Text
              style={{ color: theme.gray400 }}
              className="text-lg font-bold mr-2"
            >
              UGX
            </Text>
            <TextInput
              value={amount}
              onChangeText={(text) => {
                // Numeric cleaning
                const clean = text.replace(/[^0-9]/g, "");
                if (clean) setAmount(parseInt(clean).toLocaleString());
                else setAmount("");
              }}
              placeholder="0"
              keyboardType="numeric"
              style={{ color: theme.gray900 }}
              className="flex-1 text-2xl font-bold h-full"
              placeholderTextColor={theme.gray300}
            />
          </View>
          <Text style={{ color: theme.gray400 }} className="text-xs mt-2 ml-1">
            {txType === "withdraw" && "Limit: UGX 2,000,000"}
          </Text>
        </View>

        {/* FIELD: Payment Method */}
        <View className="mb-8">
          <Text
            style={{ color: theme.gray700 }}
            className="text-xs font-bold uppercase mb-3 ml-1"
          >
            {txType === "withdraw" ? "Receive Funds Via" : "Payment Method"}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {PAYMENT_METHODS.map((method) => {
              const isActive = paymentMethod === method.id;
              return (
                <Pressable
                  key={method.id}
                  onPress={() => setPaymentMethod(method.id)}
                  style={{
                    backgroundColor: isActive ? theme.primary : theme.card,
                    borderColor: isActive ? theme.primary : theme.gray200,
                  }}
                  className="mr-3 px-5 py-3 rounded-xl border"
                >
                  <Text
                    style={{
                      color: isActive ? "white" : theme.gray600,
                      fontWeight: "600",
                    }}
                  >
                    {method.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* FIELD: Upload Proof */}
        <View className="mb-8">
          <Text
            style={{ color: theme.gray700 }}
            className="text-xs font-bold uppercase mb-3 ml-1"
          >
            Proof of Payment
          </Text>

          {!proofImage ? (
            <Pressable
              onPress={pickImage}
              style={{
                borderStyle: "dashed",
                borderColor: theme.gray300,
                backgroundColor: theme.gray50,
              }}
              className="w-full h-40 border-2 rounded-2xl items-center justify-center mb-2"
            >
              <View
                style={{ backgroundColor: theme.white }}
                className="p-3 rounded-full shadow-sm mb-2"
              >
                <Ionicons name="camera" size={24} color={theme.primary} />
              </View>
              <Text style={{ color: theme.gray600 }} className="font-bold">
                Upload Receipt / Screenshot
              </Text>
              <Text style={{ color: theme.gray400 }} className="text-xs mt-1">
                Tap to select from gallery
              </Text>
            </Pressable>
          ) : (
            <View className="w-full">
              <View className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                <Image
                  source={{ uri: proofImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={pickImage}
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg flex-row items-center"
                >
                  <Ionicons name="refresh" size={12} color="white" />
                  <Text className="text-white text-xs font-bold ml-1">
                    Replace
                  </Text>
                </Pressable>
              </View>

              {/* OCR FEEDBACK */}
              {isOCRProcessing ? (
                <View
                  style={{ backgroundColor: theme.blue + "10" }}
                  className="p-4 rounded-xl flex-row items-center mb-4"
                >
                  <ActivityIndicator size="small" color={theme.blue} />
                  <Text
                    style={{ color: theme.blue }}
                    className="ml-3 font-bold text-xs"
                  >
                    Scanning receipt details...
                  </Text>
                </View>
              ) : (
                ocrData && (
                  <View
                    style={{
                      backgroundColor: theme.emerald + "10",
                      borderColor: theme.emerald,
                    }}
                    className="p-4 rounded-xl border border-dashed mb-4"
                  >
                    <View className="flex-row justify-between mb-2">
                      <Text
                        style={{ color: theme.emerald }}
                        className="font-bold text-xs uppercase"
                      >
                        Detected from receipt
                      </Text>
                      <Ionicons
                        name="scan-outline"
                        size={14}
                        color={theme.emerald}
                      />
                    </View>
                    <View className="flex-row justify-between">
                      <View>
                        <Text
                          style={{ color: theme.gray500 }}
                          className="text-[10px]"
                        >
                          AMOUNT
                        </Text>
                        <Text
                          style={{ color: theme.gray900 }}
                          className="font-bold"
                        >
                          {ocrData.amount}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{ color: theme.gray500 }}
                          className="text-[10px]"
                        >
                          DATE
                        </Text>
                        <Text
                          style={{ color: theme.gray900 }}
                          className="font-bold"
                        >
                          {ocrData.date}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{ color: theme.gray500 }}
                          className="text-[10px]"
                        >
                          REF
                        </Text>
                        <Text
                          style={{ color: theme.gray900 }}
                          className="font-bold"
                        >
                          {ocrData.ref}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              )}
            </View>
          )}
          <Text style={{ color: theme.gray500 }} className="text-xs leading-4">
            Please ensure the image clearly shows the transaction ID, date, and
            amount.
          </Text>
        </View>

        {/* REVIEW & DECLARATION */}
        <View
          style={{ backgroundColor: theme.gray50 }}
          className="p-5 rounded-2xl mb-8 border border-slate-100"
        >
          <Text style={{ color: theme.gray900 }} className="font-bold mb-3">
            Please confirm:
          </Text>
          <View className="space-y-2 mb-4">
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.secondary}
              />
              <Text style={{ color: theme.gray600 }} className="text-xs ml-2">
                Transaction details are correct
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.secondary}
              />
              <Text style={{ color: theme.gray600 }} className="text-xs ml-2">
                Proof of payment is genuine
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setIsDeclared(!isDeclared)}
            className="flex-row items-center pt-4 border-t border-slate-200"
          >
            <View
              style={{
                borderColor: isDeclared ? theme.primary : theme.gray300,
                backgroundColor: isDeclared ? theme.primary : "white",
              }}
              className="w-6 h-6 rounded-md border-2 items-center justify-center mr-3"
            >
              {isDeclared && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text
              style={{ color: theme.gray800 }}
              className="font-bold text-sm"
            >
              I confirm that the information is correct and any fraud detection
              will lead to my membership suspension or cancellation.
            </Text>
          </Pressable>
        </View>

        {/* SUBMIT BUTTON */}
        <View className="mb-10 w-full px-6">
          {(!isDeclared || !amount || !proofImage) && !isSubmitting && (
            <Text
              style={{ color: theme.gray400 }}
              className="text-center text-[10px] mb-3 font-bold uppercase tracking-widest"
            >
              Please complete all fields to proceed
            </Text>
          )}

          <Pressable
            disabled={!isDeclared || !amount || !proofImage || isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              {
                backgroundColor:
                  !isDeclared || !amount || !proofImage
                    ? mode === "dark"
                      ? theme.gray800
                      : theme.gray200
                    : theme.primary,

                transform: [
                  {
                    scale:
                      pressed &&
                      !isSubmitting &&
                      isDeclared &&
                      amount &&
                      proofImage
                        ? 0.96
                        : 1,
                  },
                ],

                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: !isDeclared || !amount || !proofImage ? 0 : 0.3,
                shadowRadius: 15,
                elevation: !isDeclared || !amount || !proofImage ? 0 : 8,
              },
            ]}
            className="w-full h-16 rounded-2xl items-center justify-center flex-row"
          >
            {isSubmitting ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-bold text-lg ml-3">
                  Processing...
                </Text>
              </View>
            ) : (
              <>
                <Text
                  className={`font-bold text-lg ${
                    !isDeclared || !amount || !proofImage
                      ? "text-gray-400"
                      : "text-white"
                  }`}
                >
                  Submit Transaction
                </Text>

                {isDeclared && amount && proofImage && (
                  <View className="absolute right-6 bg-white/20 p-1.5 rounded-full">
                    <Ionicons name="arrow-forward" size={18} color="white" />
                  </View>
                )}
              </>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  // 4. SUCCESS FEEDBACK
  const renderSuccess = () => (
    <View className="flex-1 justify-center items-center px-4 mt-10">
      <View
        style={{ backgroundColor: theme.emerald + "20" }}
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
      >
        <Ionicons name="checkmark" size={48} color={theme.emerald} />
      </View>

      <Text
        style={{ color: theme.gray900 }}
        className="text-2xl font-bold mb-2 text-center"
      >
        Transaction Submitted
      </Text>
      <Text style={{ color: theme.gray500 }} className="text-center mb-8 px-8">
        Your request has been received and is pending review by the treasury
        team.
      </Text>

      <View
        style={{ backgroundColor: theme.card }}
        className="w-full p-5 rounded-2xl border border-slate-100 shadow-sm mb-8"
      >
        <View className="flex-row justify-between mb-3">
          <Text
            style={{ color: theme.gray500 }}
            className="text-xs font-bold uppercase"
          >
            Status
          </Text>
          <View
            style={{ backgroundColor: theme.yellow + "20" }}
            className="px-2 py-1 rounded"
          >
            <Text
              style={{ color: theme.yellow }}
              className="text-xs font-bold uppercase"
            >
              Pending Review
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text
            style={{ color: theme.gray500 }}
            className="text-xs font-bold uppercase"
          >
            Submitted At
          </Text>
          <Text style={{ color: theme.gray800 }} className="text-sm font-bold">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text
            style={{ color: theme.gray500 }}
            className="text-xs font-bold uppercase"
          >
            Transaction ID
          </Text>
          <Text style={{ color: theme.gray800 }} className="text-sm font-bold">
            #TRX-{Math.floor(Math.random() * 10000)}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={resetFlow}
        style={{ backgroundColor: theme.gray100 }}
        className="w-full py-4 rounded-xl items-center"
      >
        <Text style={{ color: theme.gray800 }} className="font-bold">
          Back to Transact
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: theme.surface }} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {step !== "success" && renderHeader()}

          {step === "select" && renderTypeSelector()}

          {step === "form" && renderForm()}

          {step === "success" && renderSuccess()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
