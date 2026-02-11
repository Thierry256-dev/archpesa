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
  // Fix for framer-motion/moti ESM/CJS compatibility on web
  unstable_conditionNames: ["browser", "require", "react-native"],
};

module.exports = withNativeWind(config, { input: "./global.css" });
