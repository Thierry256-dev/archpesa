import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Support() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 w-full"
      style={{ backgroundColor: theme.background }}
    >
      <ScrollView className="px-6 pt-6">
        <Text className="text-3xl font-black" style={{ color: theme.text }}>
          How can we help?
        </Text>

        <Text className="mt-2 mb-8" style={{ color: theme.gray500 }}>
          Get answers or reach out to our team.
        </Text>

        {/* SEARCH BAR (Visual Only for MVP) */}
        <View
          className="p-4 rounded-2xl flex-row items-center mb-8 shadow-sm border"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="search" size={20} color={theme.gray400} />
          <Text className="ml-3" style={{ color: theme.gray400 }}>
            Search for help...
          </Text>
        </View>

        {/* CONTACT CARDS */}
        <View className="flex-row justify-between mb-10">
          <ContactCard
            icon="chatbubble-ellipses"
            title="WhatsApp"
            color={theme.success}
          />
          <ContactCard icon="call" title="Call Us" color={theme.success} />
          <ContactCard icon="mail" title="Email" color={theme.info} />
        </View>

        {/* FAQS */}
        <Text className="text-lg font-black mb-4" style={{ color: theme.text }}>
          Common Questions
        </Text>

        <FAQItem
          question="How do I increase my loan limit?"
          answer="Your loan limit is determined by your total savings multiplied by 1.5. Increase your deposits to borrow more."
        />
        <FAQItem
          question="What is the interest rate for Emergency Loans?"
          answer="Emergency loans carry an interest rate of 5% per month."
        />
        <FAQItem
          question="Can I change my guarantor?"
          answer="Guarantors can only be changed if the former guarantor turned down the request. Once the loan has been approved, you cannot change anymore."
        />

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function ContactCard({ icon, title, color }) {
  const { theme } = useTheme();

  return (
    <Pressable
      className="p-5 rounded-3xl items-center w-[30%] shadow-sm border"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
    >
      <Ionicons name={icon} size={28} color={color} />
      <Text
        className="font-bold text-[10px] mt-2"
        style={{ color: theme.text }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function FAQItem({ question, answer }) {
  const { theme } = useTheme();

  return (
    <View
      className="p-5 rounded-3xl mb-4 border"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
    >
      <Text className="font-bold text-sm mb-2" style={{ color: theme.text }}>
        {question}
      </Text>
      <Text className="text-xs leading-5" style={{ color: theme.gray500 }}>
        {answer}
      </Text>
    </View>
  );
}
