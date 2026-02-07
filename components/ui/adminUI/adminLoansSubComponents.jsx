import { useTheme } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export function LoanCard({ loan, RISK_STYLES, formatUGX, onPress }) {
  const { theme } = useTheme();

  const progress =
    loan.total_payable > 0
      ? ((loan.total_payable - loan.outstanding_balance) / loan.total_payable) *
        100
      : 0;

  const riskStyle = RISK_STYLES[loan.risk_category] || RISK_STYLES.Performing;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: theme.gray200 }}
      style={{
        backgroundColor: theme.card,
        borderColor: theme.gray100,
      }}
      className="rounded-2xl p-4 mb-3 border"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <View
            style={{ backgroundColor: theme.gray100 }}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
          >
            <Text
              style={{ color: theme.gray600 }}
              className="font-bold text-sm"
            >
              {loan.userName.charAt(0)}
            </Text>
          </View>
          <View>
            <Text style={{ color: theme.text }} className="font-bold text-sm">
              {loan.userName}
            </Text>
            <Text
              style={{ color: theme.gray500 }}
              className="text-xs font-medium"
            >
              {loan.membership_no}
            </Text>
          </View>
        </View>

        <View
          className={`flex-row items-center px-2 py-1 rounded-md ${riskStyle.bg}`}
        >
          <Ionicons
            name={riskStyle.icon}
            size={10}
            style={{ marginRight: 4 }}
            className={riskStyle.text}
          />
          <Text className={`text-[10px] font-bold uppercase ${riskStyle.text}`}>
            {loan.risk_category}
          </Text>
        </View>
      </View>

      {/* Financial Grid */}
      <View
        style={{
          backgroundColor: theme.gray50,
          borderColor: theme.gray100,
        }}
        className="flex-row justify-between items-end mb-3 p-3 rounded-xl border"
      >
        <View>
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
          >
            Balance Due
          </Text>
          <Text style={{ color: theme.text }} className="text-base font-bold">
            {formatUGX(loan.outstanding_balance)}
          </Text>
        </View>
        <View className="items-end">
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
          >
            Principal
          </Text>
          <Text
            style={{ color: theme.gray600 }}
            className="text-xs font-semibold"
          >
            {formatUGX(loan.principal_amount)}
          </Text>
        </View>
      </View>

      {/* Footer: Status & Arrears */}
      <View className="flex-row justify-between items-center mt-1">
        <View className="flex-row items-center">
          <View
            style={{
              backgroundColor:
                loan.status === "Disbursed" ? theme.indigo : theme.gray400,
            }}
            className="w-2 h-2 rounded-full mr-2"
          />
          <Text
            style={{ color: theme.gray700 }}
            className="text-xs font-bold capitalize"
          >
            {loan.status}
          </Text>
        </View>

        {loan.days_in_arrears > 0 ? (
          <Text
            style={{ color: theme.rose }}
            className="text-xs font-bold bg-rose-50 px-2 py-0.5 rounded"
          >
            {loan.days_in_arrears} Days Overdue
          </Text>
        ) : (
          <Text
            style={{ color: theme.emerald }}
            className="text-xs font-medium"
          >
            On Track
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export function ExportButtons({
  generateLoansExcelReport,
  generateLoansPdfReport,
  filteredLoans,
}) {
  const { theme } = useTheme();

  return (
    <View className="flex-row gap-3 mb-6">
      <Pressable
        onPress={() => generateLoansPdfReport(filteredLoans)}
        style={{
          backgroundColor: theme.card,
          borderColor: theme.gray200,
        }}
        className="flex-1 border py-3 rounded-xl flex-row items-center justify-center"
      >
        <Ionicons name="document-text" size={18} color={theme.primary} />
        <Text
          style={{ color: theme.gray700 }}
          className="ml-2 font-bold text-sm"
        >
          Export PDF
        </Text>
      </Pressable>

      <Pressable
        onPress={() => generateLoansExcelReport(filteredLoans)}
        style={{
          backgroundColor: theme.card,
          borderColor: theme.gray200,
        }}
        className="flex-1 border py-3 rounded-xl flex-row items-center justify-center"
      >
        <Ionicons name="grid" size={18} color={theme.emerald} />
        <Text
          style={{ color: theme.gray700 }}
          className="ml-2 font-bold text-sm"
        >
          Export Excel
        </Text>
      </Pressable>
    </View>
  );
}
