import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Palette, Moon, Sun, Volume2, Bell, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useLanguage, languageNames, Language } from '@/contexts/LanguageContext';
import { useTheme, themeDetails, ThemeName } from '@/contexts/ThemeContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, isDark, toggleDark } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundVolume, setSoundVolume] = useState([70]);
  const [voiceSpeed, setVoiceSpeed] = useState([90]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-3xl p-6 shadow-xl border border-border/30 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            {t('settings')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Globe className="w-4 h-4 text-primary" />
              {t('language')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(languageNames) as Language[]).map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    language === lang
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  {languageNames[lang]}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Palette className="w-4 h-4 text-primary" />
              {t('theme')}
            </label>
            <div className="grid gap-2">
              {(Object.keys(themeDetails) as ThemeName[]).map((themeName) => {
                const themeInfo = themeDetails[themeName];
                return (
                  <motion.button
                    key={themeName}
                    onClick={() => setTheme(themeName)}
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      theme === themeName
                        ? 'bg-primary/20 border-2 border-primary/40'
                        : 'bg-muted/30 border-2 border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-2xl">{themeInfo.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{themeInfo.name}</p>
                      <p className="text-xs text-muted-foreground">{themeInfo.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Dark mode toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium">Dark Mode</span>
            </div>
            <Switch checked={isDark} onCheckedChange={toggleDark} />
          </div>

          {/* Sound volume */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Volume2 className="w-4 h-4 text-primary" />
              Voice Volume
            </label>
            <Slider
              value={soundVolume}
              onValueChange={setSoundVolume}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">{soundVolume[0]}%</p>
          </div>

          {/* Voice speed */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              Voice Speed
            </label>
            <Slider
              value={voiceSpeed}
              onValueChange={setVoiceSpeed}
              min={50}
              max={150}
              step={10}
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">{voiceSpeed[0]}%</p>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <span className="font-medium">Daily Reminders</span>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          {/* Privacy note */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Your privacy matters</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All your data stays on your device. We never collect or share your personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
