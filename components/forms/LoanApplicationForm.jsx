import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const LOAN_TYPES = [
  {
    id: "emergency",
    label: "Emergency",
    icon: "flash",
    rate: "5%",
    color: "#f59e0b",
  },
  {
    id: "education",
    label: "Education",
    icon: "school",
    rate: "8%",
    color: "#2563eb",
  },
  {
    id: "business",
    label: "Business",
    icon: "briefcase",
    rate: "12%",
    color: "#059669",
  },
  {
    id: "development",
    label: "Development",
    icon: "home",
    rate: "10%",
    color: "#7c3aed",
  },
];

export default function LoanApplicationForm({ onClose }) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedType, setSelectedType] = useState(LOAN_TYPES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuarantors, setSelectedGuarantors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock SACCO Member Directory
  const ALL_MEMBERS = [
    { id: "M-101", name: "David Okello", phone: "0772...11" },
    { id: "M-102", name: "Sarah Namuli", phone: "0701...44" },
    { id: "M-103", name: "John Bosco", phone: "0755...99" },
    { id: "M-104", name: "Grace Akello", phone: "0782...00" },
  ];

  const filteredMembers = ALL_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleGuarantor = (member) => {
    if (selectedGuarantors.find((g) => g.id === member.id)) {
      setSelectedGuarantors((prev) => prev.filter((g) => g.id !== member.id));
    } else {
      if (selectedGuarantors.length < 3) {
        // Most SACCOs limit to 3
        setSelectedGuarantors((prev) => [...prev, member]);
        setSearchQuery(""); // Clear search after selection
      } else {
        alert("You can only select up to 3 guarantors.");
      }
    }
  };

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) onClose();
        else
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
      },
    })
  ).current;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      className="flex-1 justify-end bg-black/60"
    >
      <Animated.View
        style={{
          transform: [{ translateY: pan.y }], // Simplified for brevity, use your interpolation logic
        }}
        className="bg-white rounded-t-[40px] h-[92%] p-8"
      >
        <View
          {...panResponder.panHandlers}
          className="w-full py-2 -mt-4 mb-4 items-center"
        >
          <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-black text-slate-900">
                Apply for Loan
              </Text>
              <Text className="text-gray-500 text-sm">
                Step 1 of 2: Basic Details
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          {/* 1. NEW SECTION: LOAN TYPE SELECTOR */}
          <View className="mb-8">
            <Text className="text-slate-400 text-[10px] font-bold uppercase mb-4 ml-1">
              Select Loan Product
            </Text>
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {LOAN_TYPES.map((type) => (
                <Pressable
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  className={`w-[48%] p-4 rounded-2xl border-2 ${
                    selectedType === type.id
                      ? "border-[#07193f] bg-[#07193f]/5"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor:
                          selectedType === type.id ? "#07193f" : "#e2e8f0",
                      }}
                    >
                      <Ionicons
                        name={type.icon}
                        size={18}
                        color={selectedType === type.id ? "white" : "#64748b"}
                      />
                    </View>
                    <Text
                      className={`font-bold text-[10px] ${selectedType === type.id ? "text-[#07193f]" : "text-slate-400"}`}
                    >
                      {type.rate} APR
                    </Text>
                  </View>
                  <Text
                    className={`font-bold text-sm ${selectedType === type.id ? "text-[#07193f]" : "text-slate-600"}`}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 2. INPUT: LOAN AMOUNT */}
          <View className="mb-6">
            <Text className="text-slate-400 text-[10px] font-bold uppercase mb-2 ml-1">
              Requested Amount
            </Text>
            <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex-row items-center">
              <Text className="text-xl font-bold text-slate-400 mr-2">UGX</Text>
              <TextInput
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#cbd5e1"
                className="flex-1 text-2xl font-black text-slate-900"
              />
            </View>
            {/* Added helper text to explain the loan limit based on selection */}
            <Text className="text-[10px] text-slate-400 mt-2 ml-1 italic">
              Max limit for {selectedType} loans is 3x your savings.
            </Text>
          </View>

          {/* 3. INPUT: PURPOSE */}
          <View className="mb-6">
            <Text className="text-slate-400 text-[10px] font-bold uppercase mb-2 ml-1">
              Loan Purpose
            </Text>
            <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
              <TextInput
                multiline
                numberOfLines={3}
                placeholder="Briefly explain what the funds will be used for..."
                value={purpose}
                onChangeText={setPurpose}
                className="text-slate-800 font-medium text-base h-20 text-start"
              />
            </View>
          </View>

          {/* 4. GUARANTOR SELECTION SECTION */}
          <View className="mb-8">
            <View className="flex-row justify-between items-end mb-2 ml-1">
              <Text className="text-slate-400 text-[10px] font-bold uppercase">
                Add Loan Guarantors ({selectedGuarantors.length}/3)
              </Text>
              <Text className="text-[10px] text-blue-600 font-bold">
                Minimum 2 Required
              </Text>
            </View>

            {/* Search Input */}
            <View className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex-row items-center mb-4">
              <Ionicons name="search" size={18} color="#94a3b8" />
              <TextInput
                placeholder="Search by Member Name or ID..."
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setIsSearching(text.length > 0);
                }}
                className="flex-1 ml-3 text-slate-800 font-medium text-sm"
              />
            </View>

            {/* Search Results Dropdown (Absolute position style) */}
            {isSearching && (
              <View className="bg-white border border-slate-100 rounded-2xl shadow-xl p-2 mb-4">
                {filteredMembers.map((member) => (
                  <Pressable
                    key={member.id}
                    onPress={() => {
                      toggleGuarantor(member);
                      setIsSearching(false);
                    }}
                    className="flex-row items-center justify-between p-3 border-b border-slate-50 last:border-0"
                  >
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center mr-3">
                        <Text className="text-[10px] font-bold text-slate-600">
                          {member.name.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-slate-800 font-bold text-xs">
                          {member.name}
                        </Text>
                        <Text className="text-slate-400 text-[9px]">
                          {member.id}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="add-circle" size={20} color="#07193f" />
                  </Pressable>
                ))}
              </View>
            )}

            {/* Selected Guarantors Chips */}
            <View className="flex-row flex-wrap gap-2">
              {selectedGuarantors.map((guarantor) => (
                <View
                  key={guarantor.id}
                  className="bg-blue-50 border border-blue-100 rounded-full pl-3 pr-1 py-1 flex-row items-center"
                >
                  <Text className="text-blue-900 font-bold text-[10px] mr-2">
                    {guarantor.name}
                  </Text>
                  <Pressable
                    onPress={() => toggleGuarantor(guarantor)}
                    className="bg-white rounded-full p-1"
                  >
                    <Ionicons name="close" size={12} color="#1E40AF" />
                  </Pressable>
                </View>
              ))}

              {selectedGuarantors.length === 0 && !isSearching && (
                <View className="w-full py-6 border-2 border-dashed border-slate-100 rounded-2xl items-center justify-center">
                  <Text className="text-slate-300 text-xs italic">
                    No guarantors added yet
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* SUBMIT BUTTON */}
          <Pressable
            className="bg-[#07193f] py-5 rounded-2xl items-center shadow-xl shadow-blue-900/20"
            onPress={onClose}
          >
            <Text className="text-white font-extrabold text-lg">
              Confirm & Continue
            </Text>
          </Pressable>
          <View className="h-20" />
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
