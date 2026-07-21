import React from "react";
import { FONT_SIZE_OPTIONS, THEME_OPTIONS, useTheme } from "../context/ThemeContext";

export default function SettingsMenu({ onClose }) {
  const { themePreference, setThemePreference, fontSize, setFontSize, resolvedTheme } = useTheme();

  const themeLabels = {
    light: "فاتح",
    dark: "داكن",
    system: "حسب النظام",
  };

  return (
    <div className="settings-menu" role="menu" aria-label="إعدادات التطبيق">
      <div className="settings-section">
        <div className="settings-header">
          <strong>حجم الخط</strong>
          <span>يُطبق فورًا على جميع أجزاء التطبيق</span>
        </div>
        <div className="settings-options">
          {FONT_SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`settings-option ${fontSize === option.value ? "active" : ""}`}
              onClick={() => {
                setFontSize(option.value);
                onClose?.();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-header">
          <strong>المظهر</strong>
          <span>الحالة الحالية: {themeLabels[resolvedTheme] || "فاتح"}</span>
        </div>
        <div className="settings-options">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`settings-option ${themePreference === option.value ? "active" : ""}`}
              onClick={() => {
                setThemePreference(option.value);
                onClose?.();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
