import { useTheme } from "@/context/ThemeProvider";
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
  const { theme } = useTheme();
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
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <View
        className="absolute top-0 w-full h-20"
        style={{ backgroundColor: theme.primary }}
      />

      {/* HEADER */}
      <View
        className="px-6 pt-4 pb-12 rounded-b-[40px]"
        style={{ backgroundColor: theme.primary }}
      >
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="bg-white/10 p-2 rounded-xl"
          >
            <Ionicons name="arrow-back" size={20} color={theme.white} />
          </Pressable>

          <Text className="text-white text-xl font-bold ml-4">E-Statement</Text>
        </View>

        <Text className="text-sm px-2" style={{ color: theme.gray200 }}>
          Select a period to generate your official SACCO financial statement.
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 -mt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* RANGE SELECTION CARD */}
        <View
          className="p-6 rounded-3xl shadow-sm"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderWidth: 1,
          }}
        >
          <Text
            className="font-bold text-base mb-4"
            style={{ color: theme.text }}
          >
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
          <View
            className="p-4 rounded-2xl flex-row items-center justify-between"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
            }}
          >
            <View>
              <Text
                className="text-[10px] font-bold uppercase mb-1"
                style={{ color: theme.gray400 }}
              >
                From
              </Text>
              <Text className="font-bold" style={{ color: theme.text }}>
                {dateRange.from}
              </Text>
            </View>

            <View
              className="p-1 rounded-full"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              }}
            >
              <Ionicons name="arrow-forward" size={14} color={theme.primary} />
            </View>

            <View className="items-end">
              <Text
                className="text-[10px] font-bold uppercase mb-1"
                style={{ color: theme.gray400 }}
              >
                To
              </Text>
              <Text className="font-bold" style={{ color: theme.text }}>
                {dateRange.to}
              </Text>
            </View>
          </View>

          <Text
            className="text-[10px] mt-4 italic text-center"
            style={{ color: theme.gray400 }}
          >
            *All transactions between these dates will be included.
          </Text>
        </View>

        {/* DOCUMENT PREVIEW SECTION */}
        <View className="mt-8">
          <Text
            className="font-bold text-lg mb-4"
            style={{ color: theme.text }}
          >
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
          className="mt-8 py-5 rounded-2xl flex-row items-center justify-center shadow-lg"
          style={{
            backgroundColor: loading ? theme.gray400 : theme.primary,
            shadowColor: theme.primary,
            opacity: loading ? 0.8 : 1,
          }}
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

        <Text
          className="text-center text-[10px] mt-4 mb-10"
          style={{ color: theme.gray400 }}
        >
          Statements are digitally signed and valid for official use.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- UI COMPONENTS --- */

function RangeChip({ label, value, active, onSelect }) {
  const { theme } = useTheme();
  const isActive = active === value;

  return (
    <Pressable
      onPress={() => onSelect(value)}
      className="px-4 py-3 rounded-xl border"
      style={{
        backgroundColor: isActive ? theme.primary : theme.card,
        borderColor: isActive ? theme.primary : theme.border,
      }}
    >
      <Text
        className="text-xs font-bold"
        style={{ color: isActive ? theme.white : theme.gray500 }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function OptionCard({ title, desc, icon, active, onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="p-4 rounded-2xl border mb-3 flex-row items-center"
      style={{
        backgroundColor: active ? theme.primary + "0D" : theme.card,
        borderColor: active ? theme.primary : theme.border,
      }}
    >
      <View
        className="p-3 rounded-xl mr-4"
        style={{
          backgroundColor: active ? theme.primary : theme.primary + "0D",
        }}
      >
        <Ionicons
          name={icon}
          size={22}
          color={active ? theme.white : theme.primary}
        />
      </View>

      <View className="flex-1">
        <Text className="font-bold text-sm" style={{ color: theme.text }}>
          {title}
        </Text>
        <Text className="text-[10px]" style={{ color: theme.gray400 }}>
          {desc}
        </Text>
      </View>

      {active && (
        <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
      )}
    </Pressable>
  );
}
