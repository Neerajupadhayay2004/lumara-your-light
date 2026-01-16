import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Sparkles, SkipForward, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LumaraMascot } from './LumaraMascot';
import { useLanguage, Language } from '@/contexts/LanguageContext';

interface WelcomeBotProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const welcomeMessages: Record<Language, string[]> = {
  en: [
    "Hello, beautiful soul! I'm Lumara, your personal wellness companion.",
    "I'm so happy to see you here today. This is your safe space to heal and grow.",
    "Whether you need to talk, relax, or just take a moment to breathe, I'm here for you.",
    "Remember, you are stronger than you think, braver than you believe, and more loved than you know.",
    "Let's explore your sanctuary together. What would you like to do today?",
  ],
  hi: [
    "नमस्ते, प्यारी आत्मा! मैं लुमारा हूं, आपकी व्यक्तिगत वेलनेस साथी।",
    "आज आपको यहां देखकर मुझे बहुत खुशी हुई। यह आपके ठीक होने और बढ़ने की सुरक्षित जगह है।",
    "चाहे आपको बात करनी हो, आराम करना हो, या बस सांस लेनी हो, मैं आपके लिए यहां हूं।",
    "याद रखें, आप जितना सोचते हैं उससे ज्यादा मजबूत हैं, जितना विश्वास करते हैं उससे ज्यादा बहादुर हैं।",
    "चलो साथ मिलकर आपके आश्रय का पता लगाएं। आज आप क्या करना चाहेंगे?",
  ],
  es: [
    "¡Hola, alma hermosa! Soy Lumara, tu compañera personal de bienestar.",
    "Estoy muy feliz de verte aquí hoy. Este es tu espacio seguro para sanar y crecer.",
    "Ya sea que necesites hablar, relajarte o simplemente tomarte un momento para respirar, estoy aquí para ti.",
    "Recuerda, eres más fuerte de lo que piensas, más valiente de lo que crees y más amado de lo que sabes.",
    "Exploremos juntos tu santuario. ¿Qué te gustaría hacer hoy?",
  ],
  fr: [
    "Bonjour, belle âme! Je suis Lumara, votre compagnon de bien-être personnel.",
    "Je suis si heureuse de vous voir ici aujourd'hui. C'est votre espace sûr pour guérir et grandir.",
    "Que vous ayez besoin de parler, de vous détendre ou simplement de prendre un moment pour respirer, je suis là pour vous.",
    "Rappelez-vous, vous êtes plus fort que vous ne le pensez, plus courageux que vous ne le croyez.",
    "Explorons ensemble votre sanctuaire. Que voudriez-vous faire aujourd'hui?",
  ],
  de: [
    "Hallo, schöne Seele! Ich bin Lumara, dein persönlicher Wellness-Begleiter.",
    "Ich freue mich so, dich heute hier zu sehen. Dies ist dein sicherer Raum zum Heilen und Wachsen.",
    "Ob du reden, entspannen oder einfach einen Moment zum Atmen brauchst, ich bin für dich da.",
    "Denke daran, du bist stärker als du denkst, mutiger als du glaubst und geliebter als du weißt.",
    "Lass uns gemeinsam dein Heiligtum erkunden. Was möchtest du heute tun?",
  ],
};

// Voice settings for each language
const voiceSettings: Record<Language, { lang: string; rate: number; pitch: number }> = {
  en: { lang: 'en-US', rate: 0.9, pitch: 1.1 },
  hi: { lang: 'hi-IN', rate: 0.85, pitch: 1.0 },
  es: { lang: 'es-ES', rate: 0.9, pitch: 1.1 },
  fr: { lang: 'fr-FR', rate: 0.9, pitch: 1.1 },
  de: { lang: 'de-DE', rate: 0.9, pitch: 1.0 },
};

export const WelcomeBot = ({ isOpen, onClose, userName }: WelcomeBotProps) => {
  const { language, t } = useLanguage();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'calm' | 'speaking'>('happy');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const messages = welcomeMessages[language] || welcomeMessages.en;
  const currentMessage = messages[currentMessageIndex];

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Get the best voice for current language
  const getBestVoice = (lang: string): SpeechSynthesisVoice | null => {
    const voices = availableVoices;
    
    // Try to find a voice that matches the language
    let voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && v.name.toLowerCase().includes('female'));
    if (!voice) voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (!voice) voice = voices.find(v => v.lang === lang);
    
    return voice || null;
  };

  const speakMessage = (message: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    const settings = voiceSettings[language];
    
    utterance.lang = settings.lang;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    
    const voice = getBestVoice(settings.lang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setMascotEmotion('speaking');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setMascotEmotion('calm');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setMascotEmotion('calm');
    };
    
    utteranceRef.current = utterance;
    
    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 300);
  };

  // Typing animation and speech
  useEffect(() => {
    if (!isOpen) return;
    
    // Clear previous interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    setDisplayedText('');
    let charIndex = 0;
    
    typingIntervalRef.current = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      }
    }, 25);

    // Speak the message
    speakMessage(currentMessage);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      speechSynthesis.cancel();
    };
  }, [currentMessageIndex, isOpen, language, isMuted, availableVoices]);

  const handleNext = () => {
    if (currentMessageIndex < messages.length - 1) {
      speechSynthesis.cancel();
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentMessageIndex > 0) {
      speechSynthesis.cancel();
      setCurrentMessageIndex(prev => prev - 1);
    }
  };

  const handleSkipAll = () => {
    speechSynthesis.cancel();
    onClose();
  };

  const handleReplay = () => {
    speechSynthesis.cancel();
    setCurrentMessageIndex(0);
  };

  const handleReplayCurrentMessage = () => {
    speechSynthesis.cancel();
    // Clear and restart typing animation
    setDisplayedText('');
    let charIndex = 0;
    
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    typingIntervalRef.current = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      }
    }, 25);
    
    speakMessage(currentMessage);
  };

  const toggleMute = () => {
    if (!isMuted) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setMascotEmotion('calm');
    } else {
      // Replay current message when unmuting
      speakMessage(currentMessage);
    }
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  const greetings: Record<Language, string> = {
    en: userName ? `Hi ${userName}!` : 'Welcome!',
    hi: userName ? `नमस्ते ${userName}!` : 'स्वागत है!',
    es: userName ? `¡Hola ${userName}!` : '¡Bienvenido!',
    fr: userName ? `Salut ${userName}!` : 'Bienvenue!',
    de: userName ? `Hallo ${userName}!` : 'Willkommen!',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          className="relative w-full max-w-lg bg-card rounded-3xl p-6 shadow-2xl border border-border/30 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none" />
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipAll}
            className="absolute top-4 right-4 z-10"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative z-10">
            {/* Mascot */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{
                  y: isSpeaking ? [0, -5, 0] : 0,
                  scale: isSpeaking ? [1, 1.02, 1] : 1,
                }}
                transition={{
                  duration: 0.4,
                  repeat: isSpeaking ? Infinity : 0,
                }}
              >
                <LumaraMascot size="lg" emotion={mascotEmotion} />
              </motion.div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="font-display text-2xl font-bold text-gradient-gold flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                {greetings[language]}
                <Sparkles className="w-5 h-5" />
              </h2>
            </div>

            {/* Message */}
            <motion.div
              className="bg-muted/30 rounded-2xl p-6 mb-6 min-h-[120px] flex items-center justify-center"
            >
              <p className="text-center text-lg leading-relaxed">
                {displayedText}
                {displayedText.length < currentMessage.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle"
                  />
                )}
              </p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-4">
              {messages.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    speechSynthesis.cancel();
                    setCurrentMessageIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer hover:scale-125 ${
                    idx === currentMessageIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleReplayCurrentMessage} title="Replay this message">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 items-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentMessageIndex === 0}
                  className="disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-primary to-primary-glow min-w-[100px]"
                >
                  {currentMessageIndex < messages.length - 1 ? t('overview') === 'अवलोकन' ? 'आगे' : 'Next' : "Let's Go!"}
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleNext}
                  disabled={currentMessageIndex === messages.length - 1}
                  className="disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={handleSkipAll} className="text-xs">
                <SkipForward className="w-4 h-4 mr-1" />
                Skip
              </Button>
            </div>

            {/* Restart from beginning button */}
            {currentMessageIndex > 0 && (
              <div className="text-center mt-4">
                <Button variant="link" size="sm" onClick={handleReplay} className="text-muted-foreground text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  {t('overview') === 'अवलोकन' ? 'शुरू से देखें' : 'Start from beginning'}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
