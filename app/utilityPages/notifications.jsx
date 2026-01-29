import { useMarkAllNotificationsRead } from "@/hooks/useMarkAllNotificationsRead";
import { useMarkNotificationRead } from "@/hooks/useMarkNotificationRead";
import { useNotifications } from "@/hooks/useNotifications";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeProvider";

export default function Notifications() {
  const router = useRouter();
  const { theme } = useTheme();

  const { data: notifications = [] } = useNotifications();

  const markOneRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return past.toLocaleDateString();
  };

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
        {notifications.length > 0 && (
          <Pressable onPress={() => markAllRead.mutate()}>
            <Text
              style={{ color: theme.blue, fontWeight: "bold", fontSize: 12 }}
            >
              Mark all as read
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              type={n.type}
              title={n.title}
              desc={n.body}
              time={formatTimeAgo(n.created_at)}
              isUnread={!n.is_read}
              onPress={() => {
                if (!n.is_read) {
                  markOneRead.mutate(n.id);
                }
              }}
            />
          ))
        ) : (
          /* EMPTY STATE */
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 100,
              paddingHorizontal: 40,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.card,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons
                name="notifications-off-outline"
                size={40}
                color={theme.gray400}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.text,
                textAlign: "center",
              }}
            >
              No notifications yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.gray500,
                textAlign: "center",
                marginTop: 8,
                lineHeight: 20,
              }}
            >
              We&quot;ll notify you when something important happens, like
              account updates or new messages.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationItem({ type, title, desc, time, isUnread, onPress }) {
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
      onPress={onPress}
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
