import { TRANSACTION_TYPES } from "@/constants/transactionConfigs";
import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTransactionProofUrl } from "../../../services/member/getTransactionProofUrl";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

export function TransactHeader() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: theme.primary,
        paddingTop: insets.top + 10,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 10 },
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
      }}
      className="px-6 w-full pb-2 z-10"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="mt-2">
        <Text className="text-white text-2xl font-black tracking-tight">
          Transact
        </Text>
        <Text className="text-white/90 text-xs mt-2 font-medium">
          Submit a deposit, withdrawal, or manage your loan repayments securely.
        </Text>
      </View>
    </View>
  );
}

export function TransactionTypeSelector({ onSelectType }) {
  const { theme } = useTheme();

  const handleSelectType = (typeId) => {
    onSelectType(typeId);
  };

  return (
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
}

export function TransactionSuccess({ onReset }) {
  const { theme } = useTheme();

  return (
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
        onPress={onReset}
        style={{ backgroundColor: theme.gray100 }}
        className="w-full py-4 rounded-xl items-center"
      >
        <Text style={{ color: theme.gray800 }} className="font-bold">
          Back to Transact
        </Text>
      </Pressable>
    </View>
  );
}

export function PendingTransactionDetail({ item }) {
  const { theme } = useTheme();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const [proofUrl, setProofUrl] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (item.proof_url) {
      getTransactionProofUrl(item.proof_url).then((url) => {
        if (mounted) setProofUrl(url);
      });
    }

    return () => {
      mounted = false;
    };
  }, [item.proof_url]);

  return (
    <>
      <View
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border,
        }}
        className="p-4 rounded-[24px] border shadow-sm mb-4"
      >
        {/* 1. COMPACT HEADER: Date & Status */}
        <View className="flex-row justify-between items-center mb-3">
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold"
          >
            {formatTimeAgo(item.created_at)}
          </Text>
          <View
            style={{ backgroundColor: theme.orange + "15" }}
            className="flex-row items-center px-2 py-1 rounded-md"
          >
            <View
              style={{ backgroundColor: theme.orange }}
              className="w-1.5 h-1.5 rounded-full mr-1.5"
            />
            <Text
              style={{ color: theme.orange }}
              className="text-[9px] font-black uppercase tracking-wider"
            >
              Pending Review
            </Text>
          </View>
        </View>

        {/* 2. MAIN INFO ROW */}
        <View className="flex-row justify-between items-end mb-4">
          <View>
            <Text
              style={{ color: theme.gray500 }}
              className="text-[11px] font-medium mb-0.5 uppercase"
            >
              {item.transaction_type.replace("_", " ")}
            </Text>
            <Text
              style={{ color: theme.text }}
              className="text-lg font-black tracking-tighter"
            >
              {formatCurrency(item.amount)}
            </Text>
          </View>

          {/* Payment Method Badge */}
          <View
            style={{ backgroundColor: theme.gray100 }}
            className="flex-row items-center px-2 py-1.5 rounded-lg mb-1"
          >
            <Ionicons name="wallet-outline" size={12} color={theme.gray600} />
            <Text
              style={{ color: theme.gray700 }}
              className="ml-1 font-bold text-[10px]"
            >
              {item.payment_method.replace("_", " ")}
            </Text>
          </View>
        </View>

        {/* 3. COMPACT PROOF PREVIEW */}
        {proofUrl ? (
          <Pressable
            onPress={() => setIsImageModalVisible(true)}
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
            }}
            className="flex-row items-center p-2 rounded-xl border border-dashed"
          >
            <Image
              source={{ uri: proofUrl }}
              className="w-8 h-8 rounded-md bg-gray-200"
              resizeMode="cover"
            />

            <View className="ml-3 flex-1">
              <Text style={{ color: theme.text }} className="text-xs font-bold">
                Proof of Payment
              </Text>
              <Text
                style={{ color: theme.primary }}
                className="text-[10px] font-medium"
              >
                Tap to preview image
              </Text>
            </View>

            <Ionicons name="eye-outline" size={16} color={theme.gray400} />
          </Pressable>
        ) : (
          <View
            style={{ backgroundColor: theme.gray100 }}
            className="p-2 rounded-xl items-center"
          >
            <Text
              style={{ color: theme.gray400 }}
              className="text-[10px] font-bold"
            >
              No proof attached
            </Text>
          </View>
        )}
      </View>

      {/* 4. FULL SCREEN IMAGE MODAL */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center relative">
          <Pressable
            onPress={() => setIsImageModalVisible(false)}
            className="absolute top-12 right-6 z-50 bg-white/20 p-2 rounded-full"
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>

          {imgLoading && (
            <ActivityIndicator
              size="large"
              color="white"
              className="absolute"
            />
          )}

          <Image
            source={{ uri: proofUrl }}
            className="w-full h-full"
            resizeMode="contain"
            onLoadEnd={() => setImgLoading(false)}
          />

          <View className="absolute bottom-10 bg-black/50 px-4 py-2 rounded-full">
            <Text className="text-white text-xs font-bold">
              {item.transaction_type} • {formatTimeAgo(item.created_at)}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
