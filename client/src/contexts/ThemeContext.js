import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const lightTheme = {
  background: '#FFFFFF',
  backgroundSecondary: '#FFF8F5',
  surface: '#FFFFFF',
  surfaceHover: '#FFF0E6',
  text: '#000000',
  textSecondary: '#5F6368',
  textMuted: '#9AA0A6',
  primary: '#FF6B35',
  primaryHover: '#E55A2B',
  primaryLight: '#FFE5DC',
  secondary: '#8B4513',
  success: '#FF8C42',
  warning: '#FFA500',
  error: '#FF4500',
  info: '#FF6B35',
  border: '#FFE5DC',
  borderLight: '#FFF0E6',
  shadow: 'rgba(255, 107, 53, 0.15)',
  shadowHover: 'rgba(255, 107, 53, 0.25)',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
  glass: 'rgba(255, 255, 255, 0.95)',
  glassBorder: 'rgba(255, 107, 53, 0.2)',
};

const darkTheme = {
  background: '#000000',
  backgroundSecondary: '#000000',
  surface: '#000000',
  surfaceHover: '#111111',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#999999',
  primary: '#FF6B35',
  primaryHover: '#E55A2B',
  primaryLight: '#1A1A1A',
  secondary: '#FFFFFF',
  success: '#FF8C42',
  warning: '#FFA500',
  error: '#FF4500',
  info: '#FF6B35',
  border: '#333333',
  borderLight: '#222222',
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowHover: 'rgba(0, 0, 0, 0.7)',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
  glass: 'rgba(0, 0, 0, 0.95)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('feellink-theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    localStorage.setItem('feellink-theme', isDark ? 'dark' : 'light');
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#0D1117' : '#FF6B35');
    }
  }, [isDark]);

  const value = {
    theme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
