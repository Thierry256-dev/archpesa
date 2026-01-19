import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

export default function QuickAction({ icon, label, color, bg }) {
  return (
    <Pressable className="bg-white w-[48%] mb-2 p-5 rounded-2xl items-center justify-center active:scale-95 shadow-md">
      <Ionicons name={icon} size={28} color={color} />
      <Text className="mt-3 text-sm font-semibold text-center text-arch-blue leading-5">
        {label}
      </Text>
    </Pressable>
  );
}
