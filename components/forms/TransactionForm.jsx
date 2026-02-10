import {
  ACCOUNTS,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
} from "@/constants/transactionConfigs";
import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMemberAllInfo } from "../../hooks/useMemberAllInfo";
import { formatCurrency } from "../../utils/formatCurrency";
import { getNextDate } from "../../utils/getNextDate";
import { runOnDeviceOCR } from "../../utils/runOnDeviceOCR";

const getFinalTransactionType = (targetAccount, txType) => {
  if (txType === "repay") return "Loan_Repayment";

  switch (targetAccount) {
    case "Savings":
      return txType === "deposit" ? "Savings_Deposit" : "Savings_Withdraw";

    case "Shares":
      if (txType === "deposit") return "Share_Purchase";
      break;

    case "Fixed_Deposit":
      if (txType === "deposit") return "Fixed_Deposit";
      break;

    default:
      return "General_Transaction";
  }

  return "Unknown_Type";
};

export default function TransactionForm({
  txType,
  onChangeStep,
  onSubmit,
  isSubmitting,
}) {
  const { theme } = useTheme();
  const { loans, accounts } = useMemberAllInfo();

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

  const activeLoan = loans?.find((l) => l.status === "Disbursed");

  const isDeposit = txType === "deposit";
  const isRepay = txType === "repay";

  const selectedAccount = ACCOUNTS.find((acc) => acc.id === targetAccount);

  const transactionType = getFinalTransactionType(targetAccount, txType);

  const savingsAccount =
    accounts?.find((acc) => acc.account_type === "Savings") || {};

  const availableAccounts =
    txType === "withdraw"
      ? ACCOUNTS.filter((acc) => acc.id === "Savings")
      : ACCOUNTS;

  const numericAmount = Number(amount) || 0;

  const exceedsBalance =
    txType === "withdraw" && numericAmount > savingsAccount?.balance;

  if (!selectedAccount) {
    throw new Error("Invalid account selected");
  }

  const requiresProof = txType !== "withdraw";

  const isSubmitDisabled =
    !isDeclared ||
    !numericAmount ||
    (requiresProof && !proofImage) ||
    exceedsBalance ||
    isSubmitting;

  const runOCR = async (uri) => {
    if (!uri) return;

    setIsOCRProcessing(true);

    try {
      const result = await runOnDeviceOCR(uri);

      if (result?.external_reference) {
        setOcrData({
          external_reference: result.external_reference,
          source: result.source,
        });
      } else {
        setOcrData(null);
      }
    } catch (err) {
      console.error("OCR error:", err);
      setOcrData(null);
    } finally {
      setIsOCRProcessing(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProofImage(uri);
    }
  };

  const handleFormSubmit = () => {
    if (exceedsBalance) return;

    onSubmit({
      targetAccount,
      amount: numericAmount,
      transactionType,
      paymentMethod,
      external_reference: ocrData.external_reference,
      proofImage,
      notes,
      isDeclared,
    });
  };

  useEffect(() => {
    if (txType === "withdraw") {
      setTargetAccount("Savings");
    }
  }, [txType]);

  const lastScannedRef = useRef(null);

  useEffect(() => {
    if (!proofImage || proofImage === lastScannedRef.current) return;

    lastScannedRef.current = proofImage;
    runOCR(proofImage);
  }, [proofImage]);

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
        <Pressable onPress={() => onChangeStep("select")} className="ml-auto">
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
          {isDeposit ? "Deposit To" : isRepay ? "Repay Loan" : "Withdraw From"}
        </Text>
        <View>
          {isRepay ? (
            <View
              style={{
                backgroundColor: theme.primary + "08",
                borderColor: theme.primary + "20",
              }}
              className="p-5 rounded-3xl border mb-6"
            >
              <View className="flex-row items-center mb-4">
                <View
                  style={{ backgroundColor: theme.primary }}
                  className="p-2 rounded-xl mr-3"
                >
                  <Ionicons name="receipt" size={18} color="white" />
                </View>
                <Text
                  style={{ color: theme.text }}
                  className="text-base font-bold"
                >
                  Active Loan
                </Text>
                <View
                  style={{ backgroundColor: theme.emerald + "20" }}
                  className="ml-auto px-2 py-1 rounded-md"
                >
                  <Text
                    style={{ color: theme.emerald }}
                    className="text-[10px] font-bold uppercase"
                  >
                    In Repayment
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-end">
                <View>
                  <Text
                    style={{ color: theme.gray500 }}
                    className="text-xs font-medium mb-1"
                  >
                    Remaining Balance
                  </Text>
                  <Text
                    style={{ color: theme.text }}
                    className="text-2xl font-black tracking-tight"
                  >
                    {formatCurrency(activeLoan.outstanding_balance)}
                  </Text>
                </View>

                <View className="items-end">
                  <Text
                    style={{ color: theme.gray400 }}
                    className="text-[10px] mb-1"
                  >
                    Next Due: {getNextDate(activeLoan.disbursed_at)}
                  </Text>
                  <View
                    style={{ backgroundColor: theme.gray200 }}
                    className="h-1.5 w-24 rounded-full overflow-hidden"
                  >
                    <View
                      style={{
                        backgroundColor: theme.primary,
                        width: `${(activeLoan.amount_paid / activeLoan.total_payable) * 100}%`, // This would be (paid_amount / total_loan * 100)
                      }}
                      className="h-full"
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{ backgroundColor: theme.card }}
              className="rounded-2xl overflow-hidden border border-slate-100"
            >
              {availableAccounts.map((acc, index) => {
                const isActive = targetAccount === acc.id;
                return (
                  <Pressable
                    key={acc.id}
                    onPress={() => setTargetAccount(acc.id)}
                    style={{
                      borderBottomWidth:
                        index !== availableAccounts.length - 1 ? 1 : 0,
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
                    <View className="flex-1">
                      <Text
                        style={{
                          color: isActive ? theme.gray900 : theme.gray500,
                          fontWeight: isActive ? "700" : "400",
                        }}
                      >
                        {acc.label}
                      </Text>

                      {txType === "withdraw" && acc.id === "Savings" && (
                        <Text
                          style={{ color: theme.gray400 }}
                          className="text-[11px] mt-1"
                        >
                          Available balance:{" "}
                          {formatCurrency(savingsAccount.balance)}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
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
              const clean = text.replace(/[^0-9]/g, "");
              const numericValue = parseInt(clean || "0", 10);

              if (numericValue <= 0) {
                setAmount("");
                return;
              }

              setAmount(numericValue);
            }}
            placeholder="0"
            keyboardType="numeric"
            style={{ color: theme.gray900 }}
            className="flex-1 text-2xl font-bold h-full"
            placeholderTextColor={theme.gray300}
          />
        </View>
        {txType === "withdraw" && (
          <Text style={{ color: theme.gray400 }} className="text-xs mt-2 ml-1">
            Limit: UGX 2,000,000
          </Text>
        )}
        {exceedsBalance && (
          <Text style={{ color: theme.red }} className="text-xs mt-2 ml-1">
            Withdrawal amount exceeds your available savings balance.
          </Text>
        )}
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
      {txType !== "withdraw" && (
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
                      backgroundColor: theme.emerald + "08",
                      borderColor: theme.emerald + "30",
                    }}
                    className="p-4 rounded-2xl border border-dashed mb-6 flex-row items-center justify-between"
                  >
                    <View className="flex-1 mr-4">
                      <View className="flex-row items-center mb-1.5">
                        <Ionicons
                          name="scan-circle"
                          size={14}
                          color={theme.emerald}
                        />
                        <Text
                          style={{ color: theme.emerald }}
                          className="text-[10px] font-black uppercase ml-1.5"
                        >
                          DETECTED REFERENCE
                        </Text>
                      </View>

                      <Text
                        style={{ color: theme.text }}
                        className="font-mono text-xl font-black tracking-tight"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {ocrData.external_reference}
                      </Text>

                      <Text
                        style={{ color: theme.gray400 }}
                        className="text-[10px] mt-1.5 font-medium"
                      >
                        Extracted from{" "}
                        <Text
                          style={{ color: theme.gray500 }}
                          className="font-bold"
                        >
                          {ocrData.source}
                        </Text>
                      </Text>
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
      )}

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
          <Text style={{ color: theme.gray800 }} className="font-bold text-sm">
            I confirm that the information is correct and any fraud detection
            will lead to my membership suspension or cancellation.
          </Text>
        </Pressable>
      </View>

      {/* SUBMIT BUTTON */}
      <View className="mb-10 w-full px-6">
        {isSubmitDisabled && (
          <Text
            style={{ color: theme.gray400 }}
            className="text-center text-[10px] mb-3 font-bold uppercase tracking-widest"
          >
            Please complete all fields to proceed
          </Text>
        )}

        <Pressable
          disabled={isSubmitDisabled}
          onPress={handleFormSubmit}
          style={{
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: !isDeclared || !amount || !proofImage ? 0 : 0.3,
            shadowRadius: 15,
            elevation: !isDeclared || !amount || !proofImage ? 0 : 8,
          }}
          className="w-full h-16 rounded-2xl items-center justify-center flex-row bg-arch-blue"
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
}
