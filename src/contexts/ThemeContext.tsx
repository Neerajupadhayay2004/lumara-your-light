import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'lumara' | 'ocean' | 'forest' | 'sunset' | 'midnight';

interface ThemeColors {
  primary: string;
  primaryGlow: string;
  accent: string;
  background: string;
  card: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  lumara: {
    primary: '42 95% 55%',
    primaryGlow: '42 100% 65%',
    accent: '25 90% 65%',
    background: '40 30% 98%',
    card: '45 40% 99%',
  },
  ocean: {
    primary: '200 80% 50%',
    primaryGlow: '200 90% 60%',
    accent: '180 70% 50%',
    background: '200 30% 98%',
    card: '200 40% 99%',
  },
  forest: {
    primary: '150 60% 45%',
    primaryGlow: '150 70% 55%',
    accent: '120 50% 50%',
    background: '150 30% 98%',
    card: '150 40% 99%',
  },
  sunset: {
    primary: '15 80% 55%',
    primaryGlow: '25 90% 60%',
    accent: '350 70% 60%',
    background: '30 35% 98%',
    card: '35 45% 99%',
  },
  midnight: {
    primary: '260 70% 60%',
    primaryGlow: '280 80% 65%',
    accent: '300 60% 60%',
    background: '260 20% 10%',
    card: '260 20% 14%',
  },
};

export const themeDetails: Record<ThemeName, { name: string; icon: string; description: string }> = {
  lumara: { name: 'Lumara Gold', icon: '✨', description: 'Warm, calming golden theme' },
  ocean: { name: 'Ocean Calm', icon: '🌊', description: 'Cool, serene blue waters' },
  forest: { name: 'Forest Peace', icon: '🌿', description: 'Refreshing natural greens' },
  sunset: { name: 'Sunset Glow', icon: '🌅', description: 'Warm, cozy sunset colors' },
  midnight: { name: 'Midnight Dream', icon: '🌙', description: 'Deep, relaxing night mode' },
};

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>('lumara');
  const [isDark, setIsDark] = useState(false);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    const colors = themes[newTheme];
    
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--lumara-gold', colors.primary);
    root.style.setProperty('--lumara-gold-glow', colors.primaryGlow);
    root.style.setProperty('--accent', colors.accent);
    
    if (newTheme === 'midnight') {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  const toggleDark = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    setIsDark(!isDark);
  };

  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
