import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LOAN_TRANSACTIONS,
  SAVINGS_TRANSACTIONS,
} from "../../../constants/data";
import { generateMemberStatementPdf } from "../../../constants/generateSaccoDocument";

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
  const [statementType, setStatementType] = useState("standard");

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

  const handleDownload = async () => {
    setLoading(true);

    await generateMemberStatementPdf({
      member: {
        id: "M-001",
        name: "John Mugisha",
      },
      transactions:
        statementType === "loan" ? LOAN_TRANSACTIONS : SAVINGS_TRANSACTIONS,
      period: dateRange,
    });

    setLoading(false);
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
            desc="All savings, deposits & withdrawals"
            icon="document-text"
            active={statementType === "standard"}
            onPress={() => setStatementType("standard")}
          />

          <OptionCard
            title="Loan Statement"
            desc="Loan disbursements & repayments only"
            icon="calculator"
            active={statementType === "loan"}
            onPress={() => setStatementType("loan")}
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

function OptionCard({ title, desc, icon, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`p-4 rounded-2xl border mb-3 flex-row items-center ${
        active ? "bg-blue-50 border-[#07193f]" : "bg-white border-slate-100"
      }`}
    >
      <View
        className={`p-3 rounded-xl mr-4 ${
          active ? "bg-[#07193f]" : "bg-blue-50"
        }`}
      >
        <Ionicons name={icon} size={22} color={active ? "white" : "#07193f"} />
      </View>

      <View className="flex-1">
        <Text className="text-slate-800 font-bold text-sm">{title}</Text>
        <Text className="text-slate-400 text-[10px]">{desc}</Text>
      </View>

      {active && <Ionicons name="checkmark-circle" size={20} color="#07193f" />}
    </Pressable>
  );
}
