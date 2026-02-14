import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const slides = [
  {
    key: "1",
    title: "Welcome to ArchPesa",
    description:
      "Secure, transparent SACCO management designed for your community.",
    image: require("../../assets/images/onboard-1.webp"),
  },
  {
    key: "2",
    title: "Save & Grow Together",
    description: "Track your savings, loans, and dividends all in one place.",
    image: require("../../assets/images/onboard-2.webp"),
  },
  {
    key: "3",
    title: "Manage Your Loans",
    description: "Track your loans and dividends all in one place.",
    image: require("../../assets/images/onboard-3.webp"),
  },
  {
    key: "4",
    title: "Complete Registration",
    description: "Finish your SACCO registration to proceed.",
    image: require("../../assets/images/onboard-4.webp"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const { width, height } = useWindowDimensions();

  const isLast = index === slides.length - 1;
  const archWhite = "#ffffff";

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
    }
  });

  return (
    <View
      style={{ paddingBottom: insets.bottom + 16 }}
      className="flex-1 bg-white z-1"
    >
      <StatusBar barStyle="light-content" />

      {/* Ambient Glows */}
      <View
        style={{
          position: "absolute",
          bottom: -40,
          right: -80,
          width: 320,
          height: 320,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: 160,
          zIndex: 5,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: height * 0.1,
          left: -160,
          width: 240,
          height: 240,
          backgroundColor: "rgba(0,122,255,0.18)",
          borderRadius: 120,
          zIndex: 5,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: height * 0.35,
          right: -120,
          width: 280,
          height: 280,
          backgroundColor: "rgba(0,122,255,0.18)",
          borderRadius: 140,
          zIndex: 5,
        }}
      />

      {/* Image Slider */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              height: Math.min(height * 0.7, 520),
            }}
          >
            <Image
              source={item.image}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />

            <LinearGradient
              colors={["rgba(0,0,0,0.4)", "transparent"]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 120,
              }}
            />

            <LinearGradient
              colors={["transparent", archWhite]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 260,
              }}
            />
          </View>
        )}
      />

      {/* Floating Card */}
      <View className="flex-1 justify-end z-20">
        <View
          style={{ marginBottom: insets.bottom + 24 }}
          className="mx-5 bg-white rounded-[32px] p-8 shadow-2xl shadow-black/40"
        >
          {/* Indicators */}
          <View className="flex-row space-x-2 mb-6">
            {slides.map((_, i) => (
              <View
                key={i}
                className={`h-1.5 rounded-full ${
                  i === index ? "w-8 bg-brand-primary" : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </View>

          {/* Text */}
          <View className="mb-8">
            <Text className="text-3xl font-black text-arch-charcoal mb-3">
              {slides[index].title}
            </Text>
            <Text className="text-gray-500 text-base leading-7">
              {slides[index].description}
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row pb-6 items-center justify-between">
            {!isLast ? (
              <>
                <Pressable
                  onPress={() =>
                    flatListRef.current?.scrollToIndex({
                      index: slides.length - 1,
                      animated: true,
                    })
                  }
                >
                  <Text className="text-gray-400 font-semibold">Skip</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    flatListRef.current?.scrollToIndex({
                      index: index + 1,
                      animated: true,
                    })
                  }
                  className="bg-arch-charcoal w-14 h-14 rounded-2xl items-center justify-center"
                >
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={() => {
                  router.push("/(onboarding)/register");
                }}
                className="bg-brand-primary flex-1 h-14 rounded-2xl flex-row items-center justify-center"
              >
                <Text className="text-white font-bold text-lg mr-2">
                  Get Started
                </Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={22}
                  color="white"
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
