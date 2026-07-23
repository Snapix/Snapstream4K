import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeColor = {
  name: string;
  primary: string;
  primaryText: string;
};

export const THEMES: ThemeColor[] = [
  { name: 'Green', primary: '#9BF00B', primaryText: '#054B16' },
  { name: 'Red', primary: '#FF3B30', primaryText: '#4A0000' },
  { name: 'Blue', primary: '#0A84FF', primaryText: '#00204A' },
  { name: 'Orange', primary: '#FF9500', primaryText: '#4A2A00' },
  { name: 'Purple', primary: '#BF5AF2', primaryText: '#3A004A' },
  { name: 'Pink', primary: '#FF2D55', primaryText: '#4A0012' },
  { name: 'Yellow', primary: '#FFCC00', primaryText: '#4A3B00' },
  { name: 'Gray', primary: '#8E8E93', primaryText: '#1C1C1E' },
];

interface Settings {
  scale: number;
  theme: string;
  dontShowExternalPlayerPopup: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  scale: 100,
  theme: 'Green',
  dontShowExternalPlayerPopup: false,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('snapstream-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('snapstream-settings', JSON.stringify(settings));
    
    // Apply scale
    document.documentElement.style.fontSize = `${settings.scale}%`;
    
    // Apply theme
    const themeObj = THEMES.find(t => t.name === settings.theme) || THEMES[0];
    document.documentElement.style.setProperty('--primary', themeObj.primary);
    document.documentElement.style.setProperty('--primary-text', themeObj.primaryText);
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
