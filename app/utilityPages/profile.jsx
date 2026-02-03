import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemberAllInfo } from "../../hooks/useMemberAllInfo";

export default function Profile() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { theme, mode, setMode } = useTheme();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { profile } = useMemberAllInfo();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background }}
      className="flex-1"
    >
      <Pressable
        onPress={() => router.back()}
        className="absolute top-16 left-5 bg-blue-950/10 p-2 rounded-xl z-10"
      >
        <Ionicons name="arrow-back" size={20} color={theme.text} />
      </Pressable>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE HEADER */}
        <View
          style={{
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
          }}
          className="items-center py-10 border-b"
        >
          <View
            style={{ backgroundColor: theme.card }}
            className="w-24 h-24 rounded-full items-center justify-center border-4 border-white shadow-sm"
          >
            <Ionicons name="person" size={50} color={theme.text} />
            <Pressable
              style={{ backgroundColor: theme.primary }}
              className="absolute bottom-0 right-0 p-2 rounded-full border-2 border-white"
            >
              <Ionicons name="camera" size={14} color="white" />
            </Pressable>
          </View>

          <Text
            style={{ color: theme.text }}
            className="text-2xl font-black mt-4"
          >
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text style={{ color: theme.gray400 }} className="font-medium">
            Member ID: {profile?.membership_no}
          </Text>

          <View className="flex-row mt-4">
            <View className="bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              <Text className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                {profile?.member_status} Member
              </Text>
            </View>
          </View>
        </View>

        {/* SETTINGS GROUPS */}
        <View className="px-6 mt-8">
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase mb-4 tracking-widest"
          >
            Personal Account
          </Text>

          <ProfileMenu icon="person-outline" title="Personal Information" />
          <ProfileMenu icon="shield-checkmark-outline" title="Security & PIN" />
          <ProfileMenu icon="card-outline" title="Linked Bank/Mobile Money" />

          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase mt-8 mb-4 tracking-widest"
          >
            Preferences
          </Text>

          <ProfileMenu
            onPress={() => router.push("/utilityPages/notifications")}
            icon="notifications-outline"
            title="Notifications"
          />
          <ProfileMenu icon="language-outline" title="Language" sub="English" />

          {/* THEME TOGGLE */}
          <Pressable
            onPress={() => setMode(mode === "light" ? "dark" : "light")}
            style={{
              backgroundColor: theme.card,
              borderColor: theme.border,
            }}
            className="p-4 rounded-2xl flex-row items-center mb-3 border shadow-sm"
          >
            <View
              style={{ backgroundColor: theme.surface }}
              className="p-2.5 rounded-xl mr-4"
            >
              <Ionicons
                name={mode === "light" ? "moon-outline" : "sunny-outline"}
                size={20}
                color={mode === "light" ? theme.blue : theme.yellow}
              />
            </View>
            <Text
              style={{ color: theme.text }}
              className="flex-1 font-bold text-sm"
            >
              {mode === "light" ? "Dark Mode" : "Light Mode"}
            </Text>
            <View
              style={{
                backgroundColor:
                  mode === "dark" ? theme.primary : theme.gray300,
                width: 50,
                height: 28,
              }}
              className="rounded-full items-center justify-center flex-row"
            >
              <View
                style={{
                  backgroundColor: theme.white,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  marginLeft: mode === "dark" ? 2 : -26,
                }}
              />
            </View>
          </Pressable>

          {/* LOGOUT BUTTON */}
          <Pressable
            onPress={handleLogout}
            className="mt-10 py-5 rounded-2xl items-center border mb-20"
            style={{
              backgroundColor: mode === "light" ? "#fce7f3" : "#7f1d1d",
              borderColor: mode === "light" ? "#fbcfe8" : "#991b1b",
            }}
          >
            <Text
              style={{ color: mode === "light" ? "#be123c" : "#fecaca" }}
              className="font-black"
            >
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/*Logout POPUP */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoggingOut}
        statusBarTranslucent
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-6 rounded-3xl items-center shadow-2xl w-48">
            <ActivityIndicator size="large" color="#be123c" />
            <Text className="mt-4 text-gray-800 font-bold text-sm">
              Signing Out...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ProfileMenu({ icon, title, sub, onPress }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
      className="p-4 rounded-2xl flex-row items-center mb-3 border shadow-sm"
    >
      <View
        style={{ backgroundColor: theme.surface }}
        className="p-2.5 rounded-xl mr-4"
      >
        <Ionicons name={icon} size={20} color={theme.text} />
      </View>
      <Text style={{ color: theme.text }} className="flex-1 font-bold text-sm">
        {title}
      </Text>
      {sub && (
        <Text style={{ color: theme.gray400 }} className="text-xs mr-2">
          {sub}
        </Text>
      )}
      <Ionicons name="chevron-forward" size={18} color={theme.gray300} />
    </Pressable>
  );
}
