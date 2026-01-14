import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

export default function QuickAction({ icon, label, color, bg }) {
  return (
    <Pressable
      className={`${bg} w-[48%] mb-4 p-5 rounded-2xl items-center justify-center active:scale-95`}
    >
      <Ionicons name={icon} size={32} color={color} />
      <Text
        className={`mt-3 text-sm font-semibold text-center text-white leading-5`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
