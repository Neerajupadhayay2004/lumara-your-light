import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  welcome: {
    en: 'Welcome to Your Sanctuary',
    hi: 'आपके आश्रय में स्वागत है',
    es: 'Bienvenido a Tu Santuario',
    fr: 'Bienvenue dans Votre Sanctuaire',
    de: 'Willkommen in Ihrem Heiligtum',
  },
  tagline: {
    en: 'Your light in dark moments',
    hi: 'अंधेरे पलों में आपकी रोशनी',
    es: 'Tu luz en momentos oscuros',
    fr: 'Votre lumière dans les moments sombres',
    de: 'Ihr Licht in dunklen Momenten',
  },
  overview: {
    en: 'Overview',
    hi: 'अवलोकन',
    es: 'Resumen',
    fr: 'Aperçu',
    de: 'Übersicht',
  },
  logMood: {
    en: 'Log Mood',
    hi: 'मूड दर्ज करें',
    es: 'Registrar Estado',
    fr: 'Enregistrer Humeur',
    de: 'Stimmung Protokollieren',
  },
  insights: {
    en: 'Insights',
    hi: 'अंतर्दृष्टि',
    es: 'Perspectivas',
    fr: 'Perspectives',
    de: 'Einblicke',
  },
  sounds: {
    en: 'Sounds',
    hi: 'ध्वनियाँ',
    es: 'Sonidos',
    fr: 'Sons',
    de: 'Klänge',
  },
  meditate: {
    en: 'Meditate',
    hi: 'ध्यान करें',
    es: 'Meditar',
    fr: 'Méditer',
    de: 'Meditieren',
  },
  yoga: {
    en: 'Yoga',
    hi: 'योग',
    es: 'Yoga',
    fr: 'Yoga',
    de: 'Yoga',
  },
  games: {
    en: 'Games',
    hi: 'खेल',
    es: 'Juegos',
    fr: 'Jeux',
    de: 'Spiele',
  },
  breathe: {
    en: 'Breathe',
    hi: 'साँस लें',
    es: 'Respirar',
    fr: 'Respirer',
    de: 'Atmen',
  },
  voice: {
    en: 'Voice',
    hi: 'आवाज़',
    es: 'Voz',
    fr: 'Voix',
    de: 'Stimme',
  },
  journal: {
    en: 'Journal',
    hi: 'डायरी',
    es: 'Diario',
    fr: 'Journal',
    de: 'Tagebuch',
  },
  affirmations: {
    en: 'Affirmations',
    hi: 'प्रतिज्ञान',
    es: 'Afirmaciones',
    fr: 'Affirmations',
    de: 'Affirmationen',
  },
  sleepStories: {
    en: 'Sleep Stories',
    hi: 'नींद की कहानियाँ',
    es: 'Historias para Dormir',
    fr: 'Histoires pour Dormir',
    de: 'Schlafgeschichten',
  },
  dailyAffirmation: {
    en: 'Daily Affirmation',
    hi: 'दैनिक प्रतिज्ञान',
    es: 'Afirmación Diaria',
    fr: 'Affirmation Quotidienne',
    de: 'Tägliche Affirmation',
  },
  affirmationText: {
    en: 'You are worthy of love, peace, and all the good things life has to offer.',
    hi: 'आप प्यार, शांति और जीवन की सभी अच्छी चीजों के योग्य हैं।',
    es: 'Eres digno de amor, paz y todas las cosas buenas que la vida tiene para ofrecer.',
    fr: 'Vous méritez l\'amour, la paix et toutes les bonnes choses que la vie a à offrir.',
    de: 'Sie sind der Liebe, des Friedens und aller guten Dinge würdig, die das Leben zu bieten hat.',
  },
  talkToLumara: {
    en: 'Talk to Lumara',
    hi: 'लुमारा से बात करें',
    es: 'Habla con Lumara',
    fr: 'Parler à Lumara',
    de: 'Mit Lumara Sprechen',
  },
  settings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    es: 'Configuración',
    fr: 'Paramètres',
    de: 'Einstellungen',
  },
  login: {
    en: 'Login',
    hi: 'लॉग इन करें',
    es: 'Iniciar Sesión',
    fr: 'Connexion',
    de: 'Anmelden',
  },
  signup: {
    en: 'Sign Up',
    hi: 'साइन अप करें',
    es: 'Registrarse',
    fr: 'S\'inscrire',
    de: 'Registrieren',
  },
  logout: {
    en: 'Logout',
    hi: 'लॉग आउट',
    es: 'Cerrar Sesión',
    fr: 'Déconnexion',
    de: 'Abmelden',
  },
  sleepTimer: {
    en: 'Sleep Timer',
    hi: 'नींद टाइमर',
    es: 'Temporizador de Sueño',
    fr: 'Minuterie de Sommeil',
    de: 'Schlaf-Timer',
  },
  minutes: {
    en: 'minutes',
    hi: 'मिनट',
    es: 'minutos',
    fr: 'minutes',
    de: 'Minuten',
  },
  theme: {
    en: 'Theme',
    hi: 'थीम',
    es: 'Tema',
    fr: 'Thème',
    de: 'Thema',
  },
  language: {
    en: 'Language',
    hi: 'भाषा',
    es: 'Idioma',
    fr: 'Langue',
    de: 'Sprache',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};
