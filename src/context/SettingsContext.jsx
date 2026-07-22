import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('school_font_size') || 'medium');

  useEffect(() => {
    localStorage.setItem('school_font_size', fontSize);
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  const value = useMemo(() => ({ fontSize, setFontSize }), [fontSize]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
