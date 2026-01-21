import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export function LoanCard({ loan, RISK_STYLES, formatUGX, onPress }) {
  // Calculate specific progress for this single loan
  const progress =
    loan.principal > 0
      ? ((loan.principal - loan.balance_due) / loan.principal) * 100
      : 0;

  const riskStyle = RISK_STYLES[loan.risk_category] || RISK_STYLES.Performing;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#e5e7eb" }}
      className="bg-white rounded-2xl p-4 mb-3 border border-slate-100"
    >
      {/* Card Header: Name & Risk Badge */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
            <Text className="font-bold text-slate-600 text-sm">
              {loan.member_name.charAt(0)}
            </Text>
          </View>
          <View>
            <Text className="font-bold text-slate-900 text-sm">
              {loan.member_name}
            </Text>
            <Text className="text-xs text-slate-500 font-medium">
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
      <View className="flex-row justify-between items-end mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <View>
          <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
            Balance Due
          </Text>
          <Text className="text-base font-bold text-slate-800">
            {formatUGX(loan.balance_due)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
            Principal
          </Text>
          <Text className="text-xs font-semibold text-slate-600">
            {formatUGX(loan.principal)}
          </Text>
        </View>
      </View>

      {/* Footer: Status & Arrears */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View
            className={`w-2 h-2 rounded-full mr-2 ${loan.status === "Disbursed" ? "bg-indigo-500" : "bg-slate-400"}`}
          />
          <Text className="text-xs font-bold text-slate-700 capitalize">
            {loan.status}
          </Text>
        </View>

        {loan.days_in_arrears > 0 ? (
          <Text className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
            {loan.days_in_arrears} Days Overdue
          </Text>
        ) : (
          <Text className="text-xs text-emerald-600 font-medium">On Track</Text>
        )}
      </View>

      {/* Visual Progress Bar at very bottom */}
      <View className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
        <View
          style={{ width: `${progress}%` }}
          className="h-full bg-indigo-500"
        />
      </View>
    </Pressable>
  );
}

export function ExportButtons({
  generateLoansExcelReport,
  generateLoansPdfReport,
  filteredLoans,
}) {
  return (
    <View className="flex-row gap-3 mb-6">
      <Pressable
        onPress={() => generateLoansPdfReport(filteredLoans)}
        className="flex-1 bg-white border border-slate-200 py-3 rounded-xl flex-row items-center justify-center"
      >
        <Ionicons name="document-text" size={18} color="#07193f" />
        <Text className="ml-2 font-bold text-slate-700 text-sm">
          Export PDF
        </Text>
      </Pressable>

      <Pressable
        onPress={() => generateLoansExcelReport(filteredLoans)}
        className="flex-1 bg-white border border-slate-200 py-3 rounded-xl flex-row items-center justify-center"
      >
        <Ionicons name="grid" size={18} color="#16a34a" />
        <Text className="ml-2 font-bold text-slate-700 text-sm">
          Export Excel
        </Text>
      </Pressable>
    </View>
  );
}
