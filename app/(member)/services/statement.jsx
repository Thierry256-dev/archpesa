import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Statement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState("3M"); // 3M, 6M, 1Y, Custom
  const [previewType, setPreviewType] = useState(null);

  const dateRange = useMemo(() => {
    const toDate = new Date(); // Current Date (Today)
    const fromDate = new Date();

    if (selectedRange === "3M") {
      fromDate.setMonth(toDate.getMonth() - 3);
    } else if (selectedRange === "6M") {
      fromDate.setMonth(toDate.getMonth() - 6);
    } else if (selectedRange === "1Y") {
      fromDate.setFullYear(toDate.getFullYear() - 1);
    }

    return {
      from: formatDate(fromDate),
      to: formatDate(toDate),
    };
  }, [selectedRange]);

  const handleDownload = () => {
    setLoading(true);
    // Simulate a PDF generation delay
    setTimeout(() => {
      setLoading(false);
      alert("Statement generated and saved to downloads!");
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="absolute top-0 w-full h-20 bg-arch-blue" />
      {/* HEADER */}
      <View className="bg-[#07193f] px-6 pt-4 pb-12 rounded-b-[40px]">
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="bg-white/10 p-2 rounded-xl"
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </Pressable>
          <Text className="text-white text-xl font-bold ml-4">E-Statement</Text>
        </View>

        <Text className="text-white/70 text-sm px-2">
          Select a period to generate your official SACCO financial statement.
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 -mt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* RANGE SELECTION CARD */}
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <Text className="text-slate-800 font-bold text-base mb-4">
            Select Period
          </Text>

          {/* RANGE CHIPS */}
          <View className="flex-row justify-between mb-6">
            <RangeChip
              label="3 Months"
              value="3M"
              active={selectedRange}
              onSelect={setSelectedRange}
            />
            <RangeChip
              label="6 Months"
              value="6M"
              active={selectedRange}
              onSelect={setSelectedRange}
            />
            <RangeChip
              label="1 Year"
              value="1Y"
              active={selectedRange}
              onSelect={setSelectedRange}
            />
          </View>

          {/* DYNAMIC DATE DISPLAY */}
          <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row items-center justify-between">
            <View>
              <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                From
              </Text>
              <Text className="text-slate-800 font-bold">{dateRange.from}</Text>
            </View>

            <View className="bg-white p-1 rounded-full shadow-sm border border-slate-100">
              <Ionicons name="arrow-forward" size={14} color="#07193f" />
            </View>

            <View className="items-end">
              <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                To
              </Text>
              <Text className="text-slate-800 font-bold">{dateRange.to}</Text>
            </View>
          </View>

          <Text className="text-[10px] text-slate-400 mt-4 italic text-center">
            *All transactions between these dates will be included.
          </Text>
        </View>

        {/* DOCUMENT PREVIEW SECTION */}
        <View className="mt-8">
          <Text className="text-slate-800 font-bold text-lg mb-4">
            Statement Options
          </Text>

          <OptionCard
            title="Standard Statement"
            desc="Detailed list of all transactions"
            icon="document-attach"
            onPress={() => setPreviewType("standard")}
          />
          <OptionCard
            title="Loan specific"
            desc="Only shows loan disbursements & repayments"
            icon="calculator"
            onPress={() => setPreviewType("loan")}
          />
        </View>

        {/* GENERATE BUTTON */}
        <Pressable
          onPress={handleDownload}
          disabled={loading}
          className={`mt-8 py-5 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-900/20 ${loading ? "bg-slate-400" : "bg-[#07193f]"}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="cloud-download-outline" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Generate PDF
              </Text>
            </>
          )}
        </Pressable>

        <Text className="text-center text-slate-400 text-[10px] mt-4 mb-10">
          Statements are digitally signed and valid for official use.
        </Text>
      </ScrollView>

      <Modal
        visible={!!previewType}
        transparent
        animationType="slide"
        onRequestClose={() => setPreviewType(null)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white rounded-t-[40px] h-[80%] p-6">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-slate-900">
                Document Preview
              </Text>
              <Pressable
                onPress={() => setPreviewType(null)}
                className="bg-slate-100 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="#000" />
              </Pressable>
            </View>

            {/* THE "PAPER" PREVIEW */}
            <ScrollView
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 shadow-inner"
              showsVerticalScrollIndicator={false}
            >
              <View className="items-center mb-6">
                <View className="w-12 h-12 bg-arch-blue rounded-xl items-center justify-center mb-2">
                  <Ionicons name="business" size={24} color="white" />
                </View>
                <Text className="font-black text-slate-900 text-sm">
                  UNITY SACCO LTD
                </Text>
                <Text className="text-[10px] text-slate-400 uppercase tracking-tighter">
                  Official Financial Record
                </Text>
              </View>

              {previewType === "standard" ? (
                <StandardPreview />
              ) : (
                <LoanPreview />
              )}
            </ScrollView>

            {/* Action Button */}
            <Pressable
              className="bg-arch-blue py-5 rounded-2xl items-center shadow-lg"
              onPress={() => setPreviewType(null)}
            >
              <Text className="text-white font-extrabold">
                Download Official PDF
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* --- UI COMPONENTS --- */

function RangeChip({ label, value, active, onSelect }) {
  const isActive = active === value;
  return (
    <Pressable
      onPress={() => onSelect(value)}
      className={`px-4 py-3 rounded-xl border ${isActive ? "bg-[#07193f] border-[#07193f]" : "bg-white border-slate-100"}`}
    >
      <Text
        className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-500"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function OptionCard({ title, desc, icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white p-4 rounded-2xl border border-slate-100 mb-3 flex-row items-center"
    >
      <View className="bg-blue-50 p-3 rounded-xl mr-4">
        <Ionicons name={icon} size={22} color="#07193f" />
      </View>
      <View className="flex-1">
        <Text className="text-slate-800 font-bold text-sm">{title}</Text>
        <Text className="text-slate-400 text-[10px]">{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </Pressable>
  );
}

function StandardPreview() {
  return (
    <View>
      <View className="border-b border-slate-200 pb-2 mb-4">
        <Text className="text-[10px] font-bold text-slate-400 uppercase">
          Standard History
        </Text>
      </View>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className="flex-row justify-between mb-4 border-b border-slate-100 pb-2"
        >
          <View>
            <Text className="text-[10px] font-bold text-slate-800">
              Jan 1{i}, 2026
            </Text>
            <Text className="text-[9px] text-slate-400">Monthly Deposit</Text>
          </View>
          <Text className="text-xs font-black text-emerald-600">+50,000</Text>
        </View>
      ))}
    </View>
  );
}

function LoanPreview() {
  return (
    <View>
      <View className="border-b border-slate-200 pb-2 mb-4">
        <Text className="text-[10px] font-bold text-slate-400 uppercase">
          Loan Ledger
        </Text>
      </View>
      <View className="bg-blue-50 p-3 rounded-lg mb-4">
        <Text className="text-[10px] text-blue-800 font-bold">
          Principal: UGX 2.5M
        </Text>
        <Text className="text-[10px] text-blue-600">Interest Rate: 10%</Text>
      </View>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className="flex-row justify-between mb-4 border-b border-slate-100 pb-2"
        >
          <View>
            <Text className="text-[10px] font-bold text-slate-800">
              Payment #{i}
            </Text>
            <Text className="text-[9px] text-slate-400">Repayment</Text>
          </View>
          <Text className="text-xs font-black text-slate-900">-210,000</Text>
        </View>
      ))}
    </View>
  );
}
