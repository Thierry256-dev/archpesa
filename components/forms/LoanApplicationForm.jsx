import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoanApplicationForm({ onClose }) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");

  // Gesture Logic for Swipe Down to Close
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) onClose();
        else
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
      },
    })
  ).current;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-end bg-black/60"
    >
      <Animated.View
        style={{
          transform: [
            {
              translateY: pan.y.interpolate({
                inputRange: [0, 1000],
                outputRange: [0, 1000],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
        className="bg-white rounded-t-[40px] h-[90%] p-8"
      >
        {/* SWIPE HANDLE */}
        <View
          {...panResponder.panHandlers}
          className="w-full py-2 -mt-4 mb-4 items-center"
        >
          <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-2xl font-black text-slate-900">
                Apply for Loan
              </Text>
              <Text className="text-gray-500 text-sm">
                Fill in the details for review
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          {/* INPUT: LOAN AMOUNT */}
          <View className="mb-6">
            <Text className="text-slate-400 text-[10px] font-bold uppercase mb-2 ml-1">
              Requested Amount
            </Text>
            <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex-row items-center">
              <Text className="text-xl font-bold text-slate-400 mr-2">UGX</Text>
              <TextInput
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                className="flex-1 text-2xl font-black text-slate-900"
              />
            </View>
          </View>

          {/* INPUT: PURPOSE */}
          <View className="mb-6">
            <Text className="text-slate-400 text-[10px] font-bold uppercase mb-2 ml-1">
              Loan Purpose
            </Text>
            <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
              <TextInput
                multiline
                numberOfLines={3}
                placeholder="e.g. Scaling my retail business inventory"
                value={purpose}
                onChangeText={setPurpose}
                className="text-slate-800 font-medium text-base h-20 text-start"
              />
            </View>
          </View>

          {/* APPROVAL PATHWAY VISUAL (The Governance Feature) */}
          <View className="mb-8 bg-blue-50/50 p-5 rounded-3xl border border-blue-100">
            <Text className="text-blue-900 font-bold text-sm mb-4">
              Required Approvals
            </Text>

            <View className="space-y-4">
              <ApproverStep
                icon="ribbon-outline"
                title="SACCO President"
                role="Final Sign-off"
              />
              <ApproverStep
                icon="wallet-outline"
                title="Treasurer"
                role="Liquidity Check"
              />
              <ApproverStep
                icon="shield-checkmark-outline"
                title="Credit Manager"
                role="Risk Assessment"
              />
            </View>

            <View className="mt-4 flex-row items-center bg-blue-100/50 p-3 rounded-xl">
              <Ionicons name="information-circle" size={18} color="#1E40AF" />
              <Text className="text-blue-800 text-[10px] ml-2 flex-1 font-medium">
                Application moves sequentially from Credit Manager to the
                President.
              </Text>
            </View>
          </View>

          {/* SUBMIT BUTTON */}
          <Pressable
            className="bg-slate-900 py-5 rounded-2xl items-center shadow-xl shadow-slate-900/30"
            onPress={onClose}
          >
            <Text className="text-white font-extrabold text-lg">
              Submit Application
            </Text>
          </Pressable>
          <View className="h-20" />
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

/* --- SMALLER HELPER COMPONENT --- */
function ApproverStep({ icon, title, role }) {
  return (
    <View className="flex-row items-center">
      <View className="bg-white p-2 rounded-full shadow-sm border border-blue-100">
        <Ionicons name={icon} size={18} color="#1E40AF" />
      </View>
      <View className="ml-3">
        <Text className="text-slate-800 font-bold text-xs">{title}</Text>
        <Text className="text-blue-600 text-[10px]">{role}</Text>
      </View>
      <View className="flex-1 items-end">
        <View className="bg-slate-200 h-[1px] w-full ml-4" />
      </View>
      <Ionicons
        name="radio-button-off"
        size={16}
        color="#CBD5E1"
        className="ml-2"
      />
    </View>
  );
}
