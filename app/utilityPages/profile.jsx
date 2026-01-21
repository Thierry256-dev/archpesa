import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();

    // Hard replace to prevent back navigation
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE HEADER */}
        <View className="items-center py-10 bg-white border-b border-slate-100">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-2 left-5 bg-blue-950/10 p-2 rounded-xl"
          >
            <Ionicons name="arrow-back" size={20} color="#07193f" />
          </Pressable>

          <View className="w-24 h-24 bg-slate-100 rounded-full items-center justify-center border-4 border-white shadow-sm">
            <Ionicons name="person" size={50} color="#07193f" />
            <Pressable className="absolute bottom-0 right-0 bg-[#07193f] p-2 rounded-full border-2 border-white">
              <Ionicons name="camera" size={14} color="white" />
            </Pressable>
          </View>

          <Text className="text-2xl font-black text-slate-900 mt-4">
            Alex J. Mulyanti
          </Text>
          <Text className="text-slate-400 font-medium">Member ID: #0428</Text>

          <View className="flex-row mt-4">
            <View className="bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              <Text className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                Active Member
              </Text>
            </View>
          </View>
        </View>

        {/* SETTINGS GROUPS */}
        <View className="px-6 mt-8">
          <Text className="text-slate-400 text-[10px] font-bold uppercase mb-4 tracking-widest">
            Personal Account
          </Text>

          <ProfileMenu icon="person-outline" title="Personal Information" />
          <ProfileMenu icon="shield-checkmark-outline" title="Security & PIN" />
          <ProfileMenu icon="card-outline" title="Linked Bank/Mobile Money" />

          <Text className="text-slate-400 text-[10px] font-bold uppercase mt-8 mb-4 tracking-widest">
            Preferences
          </Text>

          <ProfileMenu icon="notifications-outline" title="Notifications" />
          <ProfileMenu icon="language-outline" title="Language" sub="English" />

          {/* LOGOUT */}
          <Pressable
            onPress={handleLogout}
            className="mt-10 py-5 bg-rose-50 rounded-2xl items-center border border-rose-100 mb-20"
          >
            <Text className="text-rose-600 font-black">Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileMenu({ icon, title, sub }) {
  return (
    <Pressable className="bg-white p-4 rounded-2xl flex-row items-center mb-3 border border-slate-100 shadow-sm shadow-slate-200/50">
      <View className="bg-slate-50 p-2.5 rounded-xl mr-4">
        <Ionicons name={icon} size={20} color="#07193f" />
      </View>
      <Text className="flex-1 text-slate-800 font-bold text-sm">{title}</Text>
      {sub && <Text className="text-slate-400 text-xs mr-2">{sub}</Text>}
      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </Pressable>
  );
}
