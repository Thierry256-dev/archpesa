import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function LoanActionCard({ title, icon, color, desc }) {
  return (
    <Pressable className="w-[48%] flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
      <View
        className={`${color} w-10 h-10 rounded-2xl items-center justify-center mb-3`}
      >
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <Text className="font-bold text-slate-900 text-sm">{title}</Text>
      <Text className="text-gray-400 text-[10px] mt-1">{desc}</Text>
    </Pressable>
  );
}
