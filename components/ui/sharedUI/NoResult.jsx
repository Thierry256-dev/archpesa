import { Image, View } from "react-native";

export default function NoFetchResult() {
  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={require("@/assets/images/no-result.png")}
        style={{
          width: "70%",
          height: "100%",
          aspectRatio: 1,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
