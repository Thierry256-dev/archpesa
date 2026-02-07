import { useTheme } from "@/context/ThemeProvider";
import { formatDateFull } from "@/utils/formatDateFull";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { formatCurrency } from "../../../utils/formatCurrency";

export function GuarantorStatusRow({ name, status, pledge }) {
  const { theme } = useTheme();

  const getStatusStyle = () => {
    switch (status) {
      case "accepted":
        return {
          textColor: theme.emerald,
          bgColor: theme.emerald + "15",
          icon: "checkmark-circle",
        };
      case "rejected":
        return {
          textColor: theme.rose,
          bgColor: theme.rose + "15",
          icon: "close-circle",
        };
      default:
        return {
          textColor: theme.orange,
          bgColor: theme.orange + "15",
          icon: "time",
        };
    }
  };

  const style = getStatusStyle();

  return (
    <View
      style={{
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
      }}
      className="flex-row items-center py-3 "
    >
      {/* Avatar/Initial */}
      <View
        style={{ backgroundColor: theme.gray100 }}
        className="w-10 h-10 rounded-full items-center justify-center"
      >
        <Text style={{ color: theme.gray600 }} className="font-bold">
          {name.charAt(0)}
        </Text>
      </View>

      <View className="flex-1 ml-3">
        <Text style={{ color: theme.text }} className="text-sm font-bold">
          {name}
        </Text>
      </View>

      <View className="items-end">
        <View
          style={{ backgroundColor: style.bgColor }}
          className="px-2 py-1 rounded-md flex-row items-center mb-1"
        >
          <Ionicons name={style.icon} size={12} color={style.textColor} />
          <Text
            style={{ color: style.textColor }}
            className="text-[10px] font-black ml-1 uppercase"
          >
            {status}
          </Text>
        </View>

        <Text style={{ color: theme.gray500 }} className="font-bold text-[9px]">
          UGX {Number(pledge).toFixed(0)}
        </Text>
      </View>
    </View>
  );
}

export function ReplacementItem({ name, id, onSelect }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onSelect}
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
        shadowColor: theme.gray200,
      }}
      className="flex-row items-center justify-between p-4 border rounded-2xl mb-3 shadow-sm"
    >
      <View className="flex-row items-center">
        <View
          style={{ backgroundColor: theme.indigo + "20" }} // Light indigo bg
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Text style={{ color: theme.indigo }} className="font-bold">
            {name.charAt(0)}
          </Text>
        </View>
        <View className="ml-3">
          <Text style={{ color: theme.text }} className="font-bold text-sm">
            {name}
          </Text>
          <Text style={{ color: theme.gray400 }} className="text-[10px]">
            Member ID: {id}
          </Text>
        </View>
      </View>
      <View
        style={{ backgroundColor: theme.indigo }}
        className="px-3 py-1.5 rounded-xl"
      >
        <Text style={{ color: theme.white }} className="font-bold text-[10px]">
          Select
        </Text>
      </View>
    </Pressable>
  );
}

export function TabButton({ label, name, activeTab, onPress }) {
  const { theme } = useTheme();
  const isActive = activeTab === name;

  return (
    <Pressable
      hitSlop={8}
      onPress={onPress}
      className="flex-1 py-3 rounded-xl items-center justify-center"
      style={{
        backgroundColor: isActive ? theme.card : "transparent",
        shadowColor: isActive ? theme.shadow : "transparent",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.1 : 0,
        shadowRadius: 4,
        elevation: isActive ? 2 : 0,
      }}
    >
      <Text
        style={{
          color: isActive ? theme.text : theme.gray400,
        }}
        className="font-bold"
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ApproverRow({ name, person, status, icon, isLast }) {
  const { theme } = useTheme();
  const isApproved = status === "Approved";

  return (
    <View
      style={{
        borderBottomColor: theme.border,
        borderBottomWidth: !isLast ? 1 : 0,
      }}
      className="flex-row justify-between items-center py-4"
    >
      <View className="flex-row items-center">
        <View
          style={{
            backgroundColor: isApproved ? theme.emerald + "15" : theme.gray50,
          }}
          className="w-10 h-10 rounded-2xl items-center justify-center"
        >
          <Ionicons
            name={icon}
            size={20}
            color={isApproved ? theme.emerald : theme.gray400}
          />
        </View>
        <View className="ml-3">
          <Text
            style={{ color: theme.gray400 }}
            className="text-[10px] font-bold uppercase"
          >
            {name}
          </Text>
          <Text style={{ color: theme.text }} className="font-bold text-sm">
            {person}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: isApproved
            ? theme.emerald + "20"
            : theme.orange + "15",
        }}
        className="px-3 py-1 rounded-full"
      >
        <Text
          style={{
            color: isApproved ? theme.emerald : theme.orange,
          }}
          className="text-[10px] font-black"
        >
          {status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

export function HistoryItem({ title, amount, date, status, reason }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
      className="mb-3 p-4 rounded-2xl flex-col border"
    >
      <View className="flex-row justify-between">
        <View className="justify-center">
          <Text style={{ color: theme.text }} className="font-bold">
            {title}
          </Text>
          <Text style={{ color: theme.gray400 }} className="text-xs">
            {date}
          </Text>
        </View>
        <View>
          <Text style={{ color: theme.text }} className="font-black">
            UGX {Number(amount).toLocaleString()}
          </Text>
          <View className="flex-row items-center">
            {status === "Completed" ? (
              <Ionicons name="checkmark-done" size={14} color={theme.emerald} />
            ) : (
              <Ionicons
                name="close-circle-outline"
                size={14}
                color={theme.red}
              />
            )}
            <Text
              style={{
                color: status === "completed" ? theme.emerald : theme.red,
              }}
              className="text-[10px] font-bold ml-1"
            >
              {status}
            </Text>
          </View>
        </View>
      </View>
      {status === "rejected" && (
        <View className="pt-4">
          <Text style={{ color: theme.red }} className="text-[12px]">
            Reason
          </Text>
          <Text style={{ color: theme.text }} className="text-xs font-semibold">
            {reason}
          </Text>
        </View>
      )}
    </View>
  );
}

export function LoanActionCard({ title, icon, color, desc }) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
        shadowColor: theme.gray200,
      }}
      className="w-[48%%] flex-row items-center justify-between p-4 rounded-3xl border shadow-sm"
    >
      <View
        className={`${color} w-10 h-10 rounded-2xl items-center justify-center mb-3`}
      >
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View className="flex-col items-center gap-3">
        <Text
          numberOfLines={1}
          style={{ color: theme.text }}
          className="font-bold text-sm"
        >
          {title}
        </Text>
        <Text style={{ color: theme.gray400 }} className="text-[10px] mt-1">
          {desc}
        </Text>
      </View>
    </Pressable>
  );
}

export function LoanStatusCard({ app }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
      className="rounded-3xl p-6 shadow-sm border mb-6"
    >
      <View className="flex-row justify-between items-center mb-4">
        <View className="bg-orange-100 px-3 py-1 rounded-full">
          <Text className="text-orange-600 font-bold text-[10px] uppercase">
            Awaiting Approval
          </Text>
        </View>
        <Text style={{ color: theme.gray400 }} className="text-xs font-medium">
          Applied: {formatDateFull(app.created_at)}
        </Text>
      </View>
      <Text
        style={{ color: theme.gray500 }}
        className="text-xs font-bold uppercase tracking-wider"
      >
        Requested Amount
      </Text>
      <Text style={{ color: theme.text }} className="text-lg font-black">
        {formatCurrency(app.requested_amount)}
      </Text>

      <Text style={{ color: theme.gray500 }} className="pt-1 text-xs italic">
        &quot;{app.purpose}.&quot;
      </Text>
    </View>
  );
}

export function ApprovedLoanCard({ loan }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
      className="rounded-3xl p-6 shadow-sm border mb-6"
    >
      <View className="flex-row justify-between items-center mb-4">
        <View className="bg-emerald-50 px-3 py-1 rounded-full">
          <Text className="text-emerald-600 font-bold text-[10px] uppercase">
            Approved
          </Text>
        </View>
        <Text style={{ color: theme.gray400 }} className="text-xs font-medium">
          Approved: {formatDateFull(loan.approved_at)}
        </Text>
      </View>
      <View className="flex-row justify-between">
        <View>
          <Text style={{ color: theme.gray500 }} className="text-xs font-bold">
            Requested Amount
          </Text>
          <Text style={{ color: theme.text }} className="text-lg font-black">
            {formatCurrency(loan.principal_amount)}
          </Text>
        </View>
        <View>
          <Text style={{ color: theme.gray500 }} className="text-xs font-bold">
            Expected To Pay
          </Text>
          <Text style={{ color: theme.text }} className="text-lg font-black">
            {formatCurrency(loan.total_payable)}
          </Text>
        </View>
      </View>

      <Text style={{ color: theme.gray500 }} className="pt-1 text-xs italic">
        &quot;{loan.purpose}.&quot;
      </Text>
      <Text className="text-xs text-orange-500 text-center mt-2">
        Awaiting Disbursement
      </Text>
    </View>
  );
}

export const GuarantorReplacementModal = ({
  visible,
  onClose,
  rejectedGuarantor,
  onReplace,
  theme,
  useSearchMemberProfiles,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isSearching, searchResults } = useSearchMemberProfiles(searchQuery);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 items-center justify-center bg-black/60">
        <View
          style={{ backgroundColor: theme.card }}
          className="rounded-[32px] h-[60%] w-[90%] p-6 shadow-2xl"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text
                style={{ color: theme.text }}
                className="text-xl font-black"
              >
                Replace Guarantor
              </Text>
              <Text style={{ color: theme.gray400 }} className="text-xs mt-1">
                Replacing:{" "}
                <Text className="font-bold">
                  {rejectedGuarantor?.guarantor_full_name}
                </Text>
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={{ backgroundColor: theme.gray100 }}
              className="p-2 rounded-full"
            >
              <Ionicons name="close" size={20} color={theme.black} />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View
            style={{
              backgroundColor: theme.gray50,
              borderColor: theme.gray100,
            }}
            className="border rounded-xl px-4 py-3 flex-row items-center mb-4"
          >
            <Ionicons name="search" size={20} color={theme.gray400} />
            <TextInput
              onChangeText={setSearchQuery}
              value={searchQuery}
              placeholder="Search member name..."
              style={{ color: theme.text }}
              placeholderTextColor={theme.gray400}
              className="flex-1 ml-3 font-medium"
              autoFocus
            />
          </View>

          {/* Results List */}
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.membership_no}
            ListHeaderComponent={
              <Text
                style={{ color: theme.gray400 }}
                className="text-[10px] font-bold uppercase mb-2"
              >
                {isSearching ? "Searching..." : "Available Members"}
              </Text>
            }
            renderItem={({ item }) => (
              <ReplacementItem
                name={`${item.first_name} ${item.last_name}`}
                id={item.membership_no}
                onSelect={() => onReplace(item)}
              />
            )}
            ListEmptyComponent={
              !isSearching &&
              searchQuery.length > 2 && (
                <Text
                  style={{ color: theme.gray400 }}
                  className="text-center text-xs mt-4"
                >
                  No members found.
                </Text>
              )
            }
          />
        </View>
      </View>
    </Modal>
  );
};
