import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
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
  const [targetAmount, setTargetAmount] = useState("");
  const [title, setTitle] = useState("");
  const [months, setMonths] = useState("12");

  // --- GESTURE LOGIC ---
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

  const monthlySaving = targetAmount
    ? (parseInt(targetAmount) / parseInt(months)).toFixed(0)
    : 0;

  function handleAddGoal() {
    if (!title || !targetAmount) return;

    const newGoal = {
      icon: "flag",
      target: targetAmount,
      title: title,
      completed: Number(Math.floor(Math.random() * 100)),
      remaining: 0,
    };
    newGoal.remaining = 100 - newGoal.completed;
    onAdd(newGoal);
    onClose();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-end bg-black/50"
    >
      <Animated.View
        style={{
          transform: [
            {
              translateY: pan.y.interpolate({
                inputRange: [-100, 0, 1000],
                outputRange: [0, 0, 1000],
              }),
            },
          ],
        }}
        className="bg-white rounded-t-[40px] p-8"
      >
        {/* HANDLE BAR AREA - The Gesture Trigger */}
        <View
          {...panResponder.panHandlers}
          className="w-full py-2 -mt-4 mb-4 items-center"
        >
          <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </View>

        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-extrabold text-gray-900">
              New Goal
            </Text>
            <Text className="text-gray-500 text-sm">
              What are you dreaming of?
            </Text>
          </View>
          <Pressable onPress={onClose} className="bg-gray-100 p-2 rounded-full">
            <Ionicons name="close" size={24} color="#64748B" />
          </Pressable>
        </View>

        {/* INPUT: GOAL NAME */}
        <View className="mb-5">
          <Text className="text-gray-400 text-[10px] font-bold uppercase mb-2 ml-1">
            Goal Name
          </Text>
          <View className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 flex-row items-center">
            <Ionicons name="pencil-outline" size={20} color="#94A3B8" />
            <TextInput
              value={title}
              onChangeText={(text) => setTitle(text)}
              placeholder="e.g. Buy Land in Mukono"
              className="flex-1 ml-3 font-semibold text-gray-800"
              placeholderTextColor="#CBD5E1"
            />
          </View>
        </View>

        {/* INPUT: TARGET AMOUNT */}
        <View className="mb-5">
          <Text className="text-gray-400 text-[10px] font-bold uppercase mb-2 ml-1">
            Target Amount (UGX)
          </Text>
          <View className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 flex-row items-center">
            <Text className="font-bold text-gray-400 mr-2">UGX</Text>
            <TextInput
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={(text) => setTargetAmount(text)}
              placeholder="0.00"
              className="flex-1 font-bold text-xl text-arch-blue"
              placeholderTextColor="#CBD5E1"
            />
          </View>
        </View>

        {/* INPUT: TIME HORIZON */}
        <View className="flex-row gap-x-4 mb-6">
          <View className="flex-1">
            <Text className="text-gray-400 text-[10px] font-bold uppercase mb-2 ml-1">
              Months to Save
            </Text>
            <View className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
              <TextInput
                keyboardType="numeric"
                value={months}
                onChangeText={setMonths}
                className="flex-1 ml-3 font-bold text-gray-800"
              />
            </View>
          </View>
        </View>

        {/* SMART CALCULATION CARD */}
        {targetAmount > 0 && (
          <View className="bg-arch-blue rounded-3xl p-5 flex-row items-center mb-8 shadow-lg shadow-blue-900/30">
            <View className="bg-white/20 p-3 rounded-2xl mr-4">
              <Ionicons name="calculator" size={28} color="#FFF" />
            </View>
            <View className="flex-1">
              <Text className="text-white/70 text-xs font-medium">
                Monthly commitment
              </Text>
              <Text className="text-white text-xl font-extrabold">
                UGX {Number(monthlySaving).toLocaleString()}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
          </View>
        )}

        {/* CREATE BUTTON */}
        <Pressable
          className="bg-emerald-500 py-5 rounded-2xl items-center shadow-md shadow-emerald-500/20"
          onPress={handleAddGoal}
        >
          <Text className="text-white font-extrabold text-lg">
            Activate Goal
          </Text>
        </Pressable>
        <View className="h-6" />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
