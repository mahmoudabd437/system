import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_KEY = "dar_bidaya_theme";
const FONT_SIZE_KEY = "dar_bidaya_font_size";

export const THEME_OPTIONS = [
  { value: "light", label: "فاتح" },
  { value: "dark", label: "داكن" },
  { value: "system", label: "حسب النظام" },
];

export const FONT_SIZE_OPTIONS = [
  { value: "small", label: "صغير", scale: 0.93 },
  { value: "medium", label: "متوسط", scale: 1 },
  { value: "large", label: "كبير", scale: 1.08 },
];

const ThemeContext = createContext(null);

function getStoredPreference(key, fallback) {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) || fallback;
}

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getFontScale(fontSize) {
  return FONT_SIZE_OPTIONS.find((option) => option.value === fontSize)?.scale || 1;
}

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreference] = useState(() => getStoredPreference(THEME_KEY, "light"));
  const [fontSize, setFontSize] = useState(() => getStoredPreference(FONT_SIZE_KEY, "medium"));
  const resolvedTheme = themePreference === "system" ? getSystemTheme() : themePreference;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = themePreference;
    root.dataset.fontSize = fontSize;
    root.style.setProperty("--app-font-scale", String(getFontScale(fontSize)));
    root.style.colorScheme = resolvedTheme;
    window.localStorage.setItem(THEME_KEY, themePreference);
    window.localStorage.setItem(FONT_SIZE_KEY, fontSize);
  }, [fontSize, resolvedTheme, themePreference]);

  useEffect(() => {
    if (themePreference !== "system" || typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const nextTheme = mediaQuery.matches ? "dark" : "light";
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
    };

    mediaQuery.addEventListener("change", handleChange);
    handleChange();
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themePreference]);

  const value = useMemo(
    () => ({
      themePreference,
      setThemePreference,
      resolvedTheme,
      fontSize,
      setFontSize,
      themeOptions: THEME_OPTIONS,
      fontSizeOptions: FONT_SIZE_OPTIONS,
    }),
    [fontSize, resolvedTheme, themePreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("يجب استخدام useTheme داخل ThemeProvider");
  }

  return context;
}
