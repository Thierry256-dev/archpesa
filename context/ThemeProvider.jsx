import React, { createContext, useContext, useMemo, useState } from "react";

const colors = {
  // Brand & Primary
  primary: "#07193f",
  secondary: "#10b981",
  surface: "#F8FAFC",
  text: "#111827",
  // Grays
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1e293b",
  gray900: "#0f172a",
  // Accent
  blue: "#2563eb",
  indigo: "#4f46e5",
  emerald: "#10b981",
  yellow: "#f59e0b",
  orange: "#ea580c",
  red: "#ef4444",
  rose: "#e11d48",
  purple: "#a855f7",
  // Custom
  archBlue: "#07193f",
  archGreen: "#10b981",
  archTeal: "#2FA4A9",
  archSlate: "#6B7280",
  archOffwhite: "#F8FAFC",
  archCharcoal: "#111827",
  // UI
  white: "#fff",
  black: "#000",
};

const lightTheme = {
  ...colors,
  background: colors.gray50,
  card: colors.white,
  surface: colors.surface,
  text: colors.text,
  border: colors.gray200,
  notification: colors.blue,
  success: colors.emerald,
};

const darkTheme = {
  ...colors,
  background: "#121212",
  card: "#1e1e1e",
  surface: "#1e1e1e",
  text: colors.gray100,
  border: colors.gray700,
  notification: colors.blue,
  primary: colors.primary,
  secondary: colors.secondary,
  error: colors.red,
  success: colors.emerald,
  warning: colors.yellow,
  info: colors.blue,
};

const ThemeContext = createContext({
  theme: lightTheme,
  mode: "light",
  setMode: () => {},
});

export function ThemeProvider({ children, initialMode = "light" }) {
  const [mode, setMode] = useState(initialMode);
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode],
  );
  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
