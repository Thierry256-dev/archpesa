import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddGoalModal({ onClose, onAdd }) {
  const { theme } = useTheme();
  const [targetAmount, setTargetAmount] = useState("");
  const [title, setTitle] = useState("");
  const [months, setMonths] = useState("12");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const getRawAmount = (val) => (val ? parseFloat(val.replace(/,/g, "")) : 0);

  const rawTarget = getRawAmount(targetAmount);
  const monthlySaving =
    rawTarget && months ? (rawTarget / parseInt(months)).toFixed(0) : 0;

  async function handleAddGoal() {
    if (!title.trim() || !rawTarget || rawTarget <= 0) {
      Alert.alert(
        "Validation Error",
        "Please enter a goal name and valid target amount.",
      );
      return;
    }

    setIsSubmitting(true);

    const goalData = {
      title: title.trim(),
      targetAmount: rawTarget,
    };

    try {
      await onAdd(goalData);
      setTargetAmount("");
      setTitle("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-end bg-black/50"
    >
      <Animated.View
        style={{
          backgroundColor: theme.card,
          transform: [
            {
              translateY: pan.y.interpolate({
                inputRange: [-100, 0, 1000],
                outputRange: [0, 0, 1000],
              }),
            },
          ],
        }}
        className="rounded-t-[40px] p-8"
      >
        {/* HANDLE BAR AREA - The Gesture Trigger */}
        <View
          {...panResponder.panHandlers}
          className="w-full py-2 -mt-4 mb-4 items-center"
        >
          <View
            style={{ backgroundColor: theme.gray200 }}
            className="w-12 h-1.5 rounded-full"
          />
        </View>

        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text
              style={{ color: theme.text }}
              className="text-2xl font-extrabold"
            >
              New Goal
            </Text>
            <Text style={{ color: theme.gray500 }} className="text-sm">
              What are you dreaming of?
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            style={{ backgroundColor: theme.gray100 }}
            className="p-2 rounded-full"
          >
            <Ionicons name="close" size={24} color={theme.gray500} />
          </Pressable>
        </View>

        {/* INPUT: GOAL NAME */}
        <View className="mb-5">
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase mb-2 ml-1"
          >
            Goal Name
          </Text>
          <View
            style={{
              backgroundColor: theme.gray50,
              borderColor: theme.gray100,
            }}
            className="border rounded-2xl px-4 py-4 flex-row items-center"
          >
            <Ionicons name="pencil-outline" size={20} color={theme.gray400} />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Buy Land in Mukono"
              className="flex-1 ml-3 font-semibold"
              style={{ color: theme.text }}
              placeholderTextColor={theme.gray300}
            />
          </View>
        </View>

        {/* INPUT: TARGET AMOUNT */}
        <View className="mb-5">
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase mb-2 ml-1"
          >
            Target Amount (UGX)
          </Text>
          <View
            style={{
              backgroundColor: theme.gray50,
              borderColor: theme.gray100,
            }}
            className="border rounded-2xl px-4 py-4 flex-row items-center"
          >
            <Text style={{ color: theme.gray400 }} className="font-bold mr-2">
              UGX
            </Text>
            <TextInput
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="0.00"
              style={{ color: theme.primary }}
              className="flex-1 font-bold text-xl"
              placeholderTextColor={theme.gray300}
            />
          </View>
        </View>

        {/* INPUT: TIME HORIZON (Visual Calculator Only) */}
        <View className="flex-row gap-x-4 mb-6">
          <View className="flex-1">
            <Text
              style={{ color: theme.gray400 }}
              className="text-[10px] font-bold uppercase mb-2 ml-1"
            >
              Months to Save
            </Text>
            <View
              style={{
                backgroundColor: theme.gray50,
                borderColor: theme.gray100,
              }}
              className="border rounded-2xl px-4 py-4 flex-row items-center"
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.gray400}
              />
              <TextInput
                keyboardType="numeric"
                value={months}
                onChangeText={setMonths}
                style={{ color: theme.text }}
                className="flex-1 ml-3 font-bold"
              />
            </View>
          </View>
        </View>

        {/* SMART CALCULATION CARD */}
        {rawTarget > 0 && (
          <View
            style={{
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
            }}
            className="rounded-3xl p-5 flex-row items-center mb-8 shadow-lg"
          >
            <View className="bg-white/20 p-3 rounded-2xl mr-4">
              <Ionicons name="calculator" size={28} color={theme.white} />
            </View>
            <View className="flex-1">
              <Text
                style={{ color: theme.white }}
                className="opacity-70 text-xs font-medium"
              >
                Monthly commitment
              </Text>
              <Text
                style={{ color: theme.white }}
                className="text-xl font-extrabold"
              >
                UGX {Number(monthlySaving).toLocaleString()}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={theme.emerald} />
          </View>
        )}

        {/* CREATE BUTTON */}
        <Pressable
          style={{
            backgroundColor: isSubmitting ? theme.gray400 : theme.emerald,
            shadowColor: isSubmitting ? "transparent" : theme.emerald,
          }}
          disabled={isSubmitting}
          className="py-5 rounded-2xl items-center shadow-md"
          onPress={handleAddGoal}
        >
          <Text
            style={{ color: theme.white }}
            className="font-extrabold text-lg"
          >
            {isSubmitting ? "Creating..." : "Activate Goal"}
          </Text>
        </Pressable>
        <View className="h-6" />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
