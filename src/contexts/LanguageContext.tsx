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
  howAreYouFeeling: {
    en: 'How are you feeling right now?',
    hi: 'आप अभी कैसा महसूस कर रहे हैं?',
    es: '¿Cómo te sientes ahora mismo?',
    fr: 'Comment vous sentez-vous maintenant?',
    de: 'Wie fühlen Sie sich gerade?',
  },
  selectEmotion: {
    en: 'Select the emotion that best describes your current state',
    hi: 'वह भावना चुनें जो आपकी वर्तमान स्थिति का सबसे अच्छा वर्णन करती है',
    es: 'Selecciona la emoción que mejor describe tu estado actual',
    fr: 'Sélectionnez l\'émotion qui décrit le mieux votre état actuel',
    de: 'Wählen Sie die Emotion, die Ihren aktuellen Zustand am besten beschreibt',
  },
  intensity: {
    en: 'Intensity',
    hi: 'तीव्रता',
    es: 'Intensidad',
    fr: 'Intensité',
    de: 'Intensität',
  },
  mild: {
    en: 'Mild',
    hi: 'हल्का',
    es: 'Leve',
    fr: 'Léger',
    de: 'Mild',
  },
  intense: {
    en: 'Intense',
    hi: 'तीव्र',
    es: 'Intenso',
    fr: 'Intense',
    de: 'Intensiv',
  },
  journalNote: {
    en: 'Journal note (optional)',
    hi: 'डायरी नोट (वैकल्पिक)',
    es: 'Nota de diario (opcional)',
    fr: 'Note de journal (facultatif)',
    de: 'Tagebuchnotiz (optional)',
  },
  journalPlaceholder: {
    en: "What's on your mind? Feel free to share...",
    hi: 'आपके मन में क्या है? बेझिझक साझा करें...',
    es: '¿Qué tienes en mente? Siéntete libre de compartir...',
    fr: 'Qu\'avez-vous en tête? N\'hésitez pas à partager...',
    de: 'Was haben Sie auf dem Herzen? Teilen Sie es gerne...',
  },
  logMyMood: {
    en: 'Log My Mood',
    hi: 'मेरा मूड दर्ज करें',
    es: 'Registrar Mi Estado',
    fr: 'Enregistrer Mon Humeur',
    de: 'Meine Stimmung Protokollieren',
  },
  saving: {
    en: 'Saving...',
    hi: 'सहेजा जा रहा है...',
    es: 'Guardando...',
    fr: 'Enregistrement...',
    de: 'Speichern...',
  },
  // Mood emotions
  happy: {
    en: 'Happy',
    hi: 'खुश',
    es: 'Feliz',
    fr: 'Heureux',
    de: 'Glücklich',
  },
  calm: {
    en: 'Calm',
    hi: 'शांत',
    es: 'Tranquilo',
    fr: 'Calme',
    de: 'Ruhig',
  },
  anxious: {
    en: 'Anxious',
    hi: 'चिंतित',
    es: 'Ansioso',
    fr: 'Anxieux',
    de: 'Ängstlich',
  },
  sad: {
    en: 'Sad',
    hi: 'उदास',
    es: 'Triste',
    fr: 'Triste',
    de: 'Traurig',
  },
  stressed: {
    en: 'Stressed',
    hi: 'तनावग्रस्त',
    es: 'Estresado',
    fr: 'Stressé',
    de: 'Gestresst',
  },
  angry: {
    en: 'Angry',
    hi: 'गुस्सा',
    es: 'Enojado',
    fr: 'En colère',
    de: 'Wütend',
  },
  lonely: {
    en: 'Lonely',
    hi: 'अकेला',
    es: 'Solitario',
    fr: 'Seul',
    de: 'Einsam',
  },
  hopeful: {
    en: 'Hopeful',
    hi: 'आशावान',
    es: 'Esperanzado',
    fr: 'Plein d\'espoir',
    de: 'Hoffnungsvoll',
  },
  neutral: {
    en: 'Neutral',
    hi: 'तटस्थ',
    es: 'Neutral',
    fr: 'Neutre',
    de: 'Neutral',
  },
  overwhelmed: {
    en: 'Overwhelmed',
    hi: 'अभिभूत',
    es: 'Abrumado',
    fr: 'Submergé',
    de: 'Überwältigt',
  },
  // Mood responses
  moodResponseHappy: {
    en: "That's wonderful! I'm so glad you're feeling happy. Let's keep this positive energy going! 🌟",
    hi: 'यह अद्भुत है! मुझे खुशी है कि आप खुश महसूस कर रहे हैं। चलो इस सकारात्मक ऊर्जा को बनाए रखें! 🌟',
    es: '¡Eso es maravilloso! Me alegra que te sientas feliz. ¡Mantengamos esta energía positiva! 🌟',
    fr: 'C\'est merveilleux! Je suis ravi que vous vous sentiez heureux. Gardons cette énergie positive! 🌟',
    de: 'Das ist wunderbar! Ich freue mich, dass Sie sich glücklich fühlen. Halten wir diese positive Energie! 🌟',
  },
  moodResponseCalm: {
    en: 'Feeling calm is such a gift. Enjoy this peaceful moment, you deserve it. 🕊️',
    hi: 'शांत महसूस करना एक तोहफा है। इस शांतिपूर्ण पल का आनंद लें, आप इसके योग्य हैं। 🕊️',
    es: 'Sentirse tranquilo es un regalo. Disfruta este momento de paz, te lo mereces. 🕊️',
    fr: 'Se sentir calme est un cadeau. Profitez de ce moment paisible, vous le méritez. 🕊️',
    de: 'Sich ruhig zu fühlen ist ein Geschenk. Genießen Sie diesen friedlichen Moment. 🕊️',
  },
  moodResponseAnxious: {
    en: "I understand anxiety can be tough. Remember to breathe deeply. I'm here to support you. 💙",
    hi: 'मैं समझता हूं कि चिंता कठिन हो सकती है। गहरी सांस लेना याद रखें। मैं आपका साथ देने के लिए यहां हूं। 💙',
    es: 'Entiendo que la ansiedad puede ser difícil. Recuerda respirar profundamente. Estoy aquí para apoyarte. 💙',
    fr: 'Je comprends que l\'anxiété peut être difficile. N\'oubliez pas de respirer profondément. Je suis là pour vous. 💙',
    de: 'Ich verstehe, dass Angst schwer sein kann. Denken Sie daran, tief zu atmen. Ich bin für Sie da. 💙',
  },
  moodResponseSad: {
    en: "It's okay to feel sad. Your feelings are valid. I'm here to listen and support you. 💛",
    hi: 'उदास महसूस करना ठीक है। आपकी भावनाएं वैध हैं। मैं आपकी बात सुनने और समर्थन करने के लिए यहां हूं। 💛',
    es: 'Está bien sentirse triste. Tus sentimientos son válidos. Estoy aquí para escucharte y apoyarte. 💛',
    fr: 'C\'est normal de se sentir triste. Vos sentiments sont valides. Je suis là pour vous écouter. 💛',
    de: 'Es ist okay, traurig zu sein. Ihre Gefühle sind berechtigt. Ich bin hier, um zuzuhören. 💛',
  },
  moodResponseStressed: {
    en: "Stress can be overwhelming. Let's find some calm together. You're not alone in this. 🌿",
    hi: 'तनाव भारी हो सकता है। चलो साथ मिलकर शांति खोजें। आप इसमें अकेले नहीं हैं। 🌿',
    es: 'El estrés puede ser abrumador. Encontremos algo de calma juntos. No estás solo en esto. 🌿',
    fr: 'Le stress peut être accablant. Trouvons un peu de calme ensemble. Vous n\'êtes pas seul. 🌿',
    de: 'Stress kann überwältigend sein. Lass uns gemeinsam Ruhe finden. Sie sind nicht allein. 🌿',
  },
  moodResponseAngry: {
    en: 'Anger is a natural emotion. Let it out safely. Would you like to talk about what upset you? 🔥',
    hi: 'गुस्सा एक स्वाभाविक भावना है। इसे सुरक्षित रूप से बाहर निकालें। क्या आप बताना चाहेंगे कि आपको क्या परेशान किया? 🔥',
    es: 'La ira es una emoción natural. Déjalo salir de forma segura. ¿Te gustaría hablar de lo que te molestó? 🔥',
    fr: 'La colère est une émotion naturelle. Laissez-la sortir en toute sécurité. Voulez-vous en parler? 🔥',
    de: 'Wut ist eine natürliche Emotion. Lassen Sie sie sicher heraus. Möchten Sie darüber sprechen? 🔥',
  },
  moodResponseLonely: {
    en: "Loneliness is hard, but remember you're not truly alone. I'm here with you. 🤗",
    hi: 'अकेलापन कठिन है, लेकिन याद रखें आप वास्तव में अकेले नहीं हैं। मैं आपके साथ हूं। 🤗',
    es: 'La soledad es difícil, pero recuerda que no estás realmente solo. Estoy aquí contigo. 🤗',
    fr: 'La solitude est difficile, mais rappelez-vous que vous n\'êtes pas vraiment seul. Je suis avec vous. 🤗',
    de: 'Einsamkeit ist schwer, aber denken Sie daran, dass Sie nicht wirklich allein sind. Ich bin bei Ihnen. 🤗',
  },
  moodResponseHopeful: {
    en: 'Hope is powerful! Hold onto that light. Better days are coming. ✨',
    hi: 'आशा शक्तिशाली है! उस रोशनी को पकड़े रहें। बेहतर दिन आ रहे हैं। ✨',
    es: '¡La esperanza es poderosa! Aférrate a esa luz. Días mejores están por venir. ✨',
    fr: 'L\'espoir est puissant! Accrochez-vous à cette lumière. De meilleurs jours arrivent. ✨',
    de: 'Hoffnung ist mächtig! Halten Sie an diesem Licht fest. Bessere Tage kommen. ✨',
  },
  moodResponseNeutral: {
    en: "Feeling neutral is okay. It's a moment of balance. Let's explore what might spark joy. 😊",
    hi: 'तटस्थ महसूस करना ठीक है। यह संतुलन का क्षण है। चलो देखें क्या खुशी ला सकता है। 😊',
    es: 'Sentirse neutral está bien. Es un momento de equilibrio. Exploremos qué podría traer alegría. 😊',
    fr: 'Se sentir neutre est bien. C\'est un moment d\'équilibre. Explorons ce qui pourrait apporter de la joie. 😊',
    de: 'Sich neutral zu fühlen ist okay. Es ist ein Moment der Balance. Lass uns erkunden, was Freude bringen könnte. 😊',
  },
  moodResponseOverwhelmed: {
    en: "Being overwhelmed is exhausting. Take a deep breath. We'll get through this together, one step at a time. 🫂",
    hi: 'अभिभूत होना थकाऊ है। एक गहरी सांस लें। हम इसे एक साथ पार करेंगे, एक कदम एक बार। 🫂',
    es: 'Estar abrumado es agotador. Respira profundo. Saldremos de esto juntos, paso a paso. 🫂',
    fr: 'Être submergé est épuisant. Prenez une grande inspiration. Nous traverserons cela ensemble. 🫂',
    de: 'Überwältigt zu sein ist erschöpfend. Atmen Sie tief durch. Wir schaffen das gemeinsam. 🫂',
  },
  letsChat: {
    en: "Let's chat and I'll help you feel better...",
    hi: 'चलो बात करते हैं और मैं आपको बेहतर महसूस कराने में मदद करूंगा...',
    es: 'Hablemos y te ayudaré a sentirte mejor...',
    fr: 'Discutons et je vous aiderai à vous sentir mieux...',
    de: 'Lass uns reden und ich helfe dir, dich besser zu fühlen...',
  },
  redirectingToChat: {
    en: 'Redirecting you to chat...',
    hi: 'आपको चैट पर ले जा रहा है...',
    es: 'Redirigiéndote al chat...',
    fr: 'Redirection vers le chat...',
    de: 'Weiterleitung zum Chat...',
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
  visualizer: {
    en: '3D Visualizer',
    hi: '3D विज़ुअलाइज़र',
    es: 'Visualizador 3D',
    fr: 'Visualiseur 3D',
    de: '3D-Visualizer',
  },
  crisisSupport: {
    en: 'Crisis Support',
    hi: 'संकट सहायता',
    es: 'Apoyo en Crisis',
    fr: 'Soutien de Crise',
    de: 'Krisenunterstützung',
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
