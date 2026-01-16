import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Support() {
  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <ScrollView className="px-6 pt-6">
        <Text className="text-3xl font-black text-slate-900">
          How can we help?
        </Text>
        <Text className="text-slate-500 mt-2 mb-8">
          Get answers or reach out to our team.
        </Text>

        {/* SEARCH BAR (Visual Only for MVP) */}
        <View className="bg-white border border-slate-100 p-4 rounded-2xl flex-row items-center mb-8 shadow-sm">
          <Ionicons name="search" size={20} color="#94a3b8" />
          <Text className="text-slate-400 ml-3">Search for help...</Text>
        </View>

        {/* CONTACT CARDS */}
        <View className="flex-row justify-between mb-10">
          <ContactCard
            icon="chatbubble-ellipses"
            title="WhatsApp"
            color="#25D366"
          />
          <ContactCard icon="call" title="Call Us" color="#07193f" />
          <ContactCard icon="mail" title="Email" color="#3b82f6" />
        </View>

        {/* FAQS */}
        <Text className="text-lg font-black text-slate-900 mb-4">
          Common Questions
        </Text>
        <FAQItem
          question="How do I increase my loan limit?"
          answer="Your loan limit is determined by your total savings multiplied by 3. Increase your deposits to borrow more."
        />
        <FAQItem
          question="What is the interest rate for Emergency Loans?"
          answer="Emergency loans carry an interest rate of 5% per month."
        />
        <FAQItem
          question="Can I change my guarantor?"
          answer="Guarantors can only be changed if the new guarantor has sufficient free savings to cover the pledge."
        />

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactCard({ icon, title, color }) {
  return (
    <Pressable className="bg-white p-5 rounded-3xl border border-slate-100 items-center w-[30%] shadow-sm">
      <Ionicons name={icon} size={28} color={color} />
      <Text className="text-slate-800 font-bold text-[10px] mt-2">{title}</Text>
    </Pressable>
  );
}

function FAQItem({ question, answer }) {
  return (
    <View className="bg-white p-5 rounded-3xl border border-slate-100 mb-4">
      <Text className="text-slate-900 font-bold text-sm mb-2">{question}</Text>
      <Text className="text-slate-500 text-xs leading-5">{answer}</Text>
    </View>
  );
}
