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
  backgroundSecondary: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceHover: '#F1F3F4',
  text: '#1A1A1A',
  textSecondary: '#5F6368',
  textMuted: '#9AA0A6',
  primary: '#FF6B35',
  primaryHover: '#E55A2B',
  primaryLight: '#FFE5DC',
  secondary: '#5F6368',
  success: '#34A853',
  warning: '#FBBC04',
  error: '#EA4335',
  info: '#4285F4',
  border: '#DADCE0',
  borderLight: '#F1F3F4',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowHover: 'rgba(0, 0, 0, 0.12)',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
  glass: 'rgba(255, 255, 255, 0.9)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
};

const darkTheme = {
  background: '#0D1117',
  backgroundSecondary: '#161B22',
  surface: '#161B22',
  surfaceHover: '#21262D',
  text: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  primary: '#FF6B35',
  primaryHover: '#E55A2B',
  primaryLight: '#2D1B17',
  secondary: '#8B949E',
  success: '#3FB950',
  warning: '#D29922',
  error: '#F85149',
  info: '#58A6FF',
  border: '#30363D',
  borderLight: '#21262D',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowHover: 'rgba(0, 0, 0, 0.4)',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
  glass: 'rgba(22, 27, 34, 0.9)',
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
