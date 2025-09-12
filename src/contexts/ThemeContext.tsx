import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('paraboda_theme') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Update isDark based on mode and system preference
  useEffect(() => {
    const updateTheme = () => {
      if (mode === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemDark);
        document.documentElement.classList.toggle('dark', systemDark);
      } else {
        setIsDark(mode === 'dark');
        document.documentElement.classList.toggle('dark', mode === 'dark');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('paraboda_theme', mode);
  }, [mode]);

  // Toggle between light and dark mode
  const toggleMode = () => {
    setMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      // If system, set to the opposite of current system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};