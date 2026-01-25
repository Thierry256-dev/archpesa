import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeProvider";

export default function Notifications() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 8, marginLeft: -8 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: theme.text,
              marginLeft: 8,
            }}
          >
            Notifications
          </Text>
        </View>
        <Pressable>
          <Text style={{ color: theme.blue, fontWeight: "bold", fontSize: 12 }}>
            Mark all as read
          </Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <NotificationItem
          type="loan"
          title="Loan Approved! 🎉"
          desc="Your Emergency Loan of UGX 500k has been approved by the President."
          time="2 mins ago"
          isUnread
        />
        <NotificationItem
          type="savings"
          title="Deposit Confirmed"
          desc="Your monthly savings contribution of UGX 50,000 has been received."
          time="1 hour ago"
          isUnread
        />
        <NotificationItem
          type="alert"
          title="Payment Reminder"
          desc="Your loan installment of UGX 120,000 is due in 3 days."
          time="Yesterday"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationItem({ type, title, desc, time, isUnread }) {
  const { theme } = useTheme();
  const getIcon = () => {
    if (type === "loan")
      return { name: "cash-outline", color: theme.blue, bg: theme.background };
    if (type === "savings")
      return {
        name: "wallet-outline",
        color: theme.emerald,
        bg: theme.background,
      };
    return {
      name: "alert-circle-outline",
      color: theme.rose,
      bg: theme.background,
    };
  };

  const icon = getIcon();

  return (
    <Pressable
      style={{
        flexDirection: "row",
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        backgroundColor: isUnread ? theme.blue + "20" : theme.card,
      }}
    >
      <View
        style={{
          backgroundColor: icon.bg,
          width: 48,
          height: 48,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon.name} size={24} color={icon.color} />
      </View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: isUnread ? "900" : "bold",
              color: isUnread ? theme.text : theme.gray700,
            }}
          >
            {title}
          </Text>
          {isUnread && (
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: theme.blue,
                borderRadius: 4,
                marginTop: 6,
              }}
            />
          )}
        </View>
        <Text
          style={{
            color: theme.gray500,
            fontSize: 12,
            marginTop: 4,
            lineHeight: 16,
          }}
        >
          {desc}
        </Text>
        <Text
          style={{
            color: theme.gray400,
            fontSize: 10,
            marginTop: 8,
            fontWeight: "500",
          }}
        >
          {time}
        </Text>
      </View>
    </Pressable>
  );
}
