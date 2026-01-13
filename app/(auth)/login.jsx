import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold mb-2">ArchPesa</Text>
      <Text className="text-gray-500 mb-10">SACCO Management System</Text>

      <Pressable
        className="w-full bg-black py-4 rounded-xl mb-4"
        onPress={() => router.replace("/(admin)/(tabs)/dashboard")}
      >
        <Text className="text-white text-center font-semibold">
          Login as Admin
        </Text>
      </Pressable>

      <Pressable
        className="w-full bg-gray-200 py-4 rounded-xl"
        onPress={() => router.replace("/(member)/(tabs)/dashboard")}
      >
        <Text className="text-center font-semibold">Login as Member</Text>
      </Pressable>
    </View>
  );
}
