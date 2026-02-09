import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

export const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "#16a34a",
  icon,
  requireReason = false,
  isProcessing = false,
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!visible) setReason("");
  }, [visible]);

  const handleConfirm = () => {
    onConfirm(reason);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="bg-white w-full rounded-3xl p-6 shadow-xl">
          {icon && (
            <View className="items-center mb-4">
              <Ionicons name={icon} size={42} color={confirmColor} />
            </View>
          )}

          <Text className="text-lg font-bold text-slate-900 text-center mb-2">
            {title}
          </Text>

          <Text className="text-slate-600 text-center mb-4">{message}</Text>

          {requireReason && (
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-500 uppercase mb-1">
                Rejection Reason
              </Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Enter reason for rejection..."
                multiline
                className="border border-slate-200 rounded-xl p-3 text-sm text-slate-800 bg-slate-50 min-h-[80px]"
              />
            </View>
          )}

          {/* Actions */}
          <View className="flex-row gap-3 mt-2">
            <Pressable
              onPress={onClose}
              disabled={isProcessing}
              className="flex-1 h-12 rounded-xl bg-slate-100 items-center justify-center"
            >
              <Text className="font-bold text-slate-600">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              disabled={isProcessing || (requireReason && !reason.trim())}
              style={{ backgroundColor: confirmColor }}
              className="flex-1 h-12 rounded-xl items-center justify-center"
            >
              <Text className="font-bold text-white">{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
