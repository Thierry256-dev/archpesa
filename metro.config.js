const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ensure platform extensions are properly resolved
config.resolver = {
  ...config.resolver,
  sourceExts: [
    ...(config.resolver?.sourceExts || []),
    "jsx",
    "js",
    "ts",
    "tsx",
  ],

  unstable_conditionNames: ["browser", "require", "react-native"],
};
config.resolver.assetExts.push("webp");

module.exports = withNativeWind(config, { input: "./global.css" });
