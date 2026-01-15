import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LumaraMascot } from './LumaraMascot';

interface WelcomeBotProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const welcomeMessages = [
  "Hello, beautiful soul! I'm Lumara, your personal wellness companion.",
  "I'm so happy to see you here today. This is your safe space to heal and grow.",
  "Whether you need to talk, relax, or just take a moment to breathe, I'm here for you.",
  "Remember, you are stronger than you think, braver than you believe, and more loved than you know.",
  "Let's explore your sanctuary together. What would you like to do today?",
];

const hindiMessages = [
  "नमस्ते, प्यारी आत्मा! मैं लुमारा हूं, आपकी व्यक्तिगत वेलनेस साथी।",
  "आज आपको यहां देखकर मुझे बहुत खुशी हुई। यह आपके ठीक होने और बढ़ने की सुरक्षित जगह है।",
  "चाहे आपको बात करनी हो, आराम करना हो, या बस सांस लेनी हो, मैं आपके लिए यहां हूं।",
];

export const WelcomeBot = ({ isOpen, onClose, userName }: WelcomeBotProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'calm'>('happy');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentMessage = welcomeMessages[currentMessageIndex];

  useEffect(() => {
    if (!isOpen) return;
    
    setDisplayedText('');
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);

    // Speak the message
    if (!isMuted && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentMessage);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setMascotEmotion('happy');
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setMascotEmotion('calm');
      };
      utteranceRef.current = utterance;
      
      // Wait a bit before speaking
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 500);
    }

    return () => {
      clearInterval(typeInterval);
      speechSynthesis.cancel();
    };
  }, [currentMessageIndex, isOpen, isMuted]);

  const handleNext = () => {
    if (currentMessageIndex < welcomeMessages.length - 1) {
      speechSynthesis.cancel();
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    speechSynthesis.cancel();
    onClose();
  };

  const toggleMute = () => {
    if (!isMuted) {
      speechSynthesis.cancel();
    }
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

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
            onClick={handleSkip}
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
                }}
                transition={{
                  duration: 0.5,
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
                {userName ? `Hi ${userName}!` : 'Welcome!'}
                <Sparkles className="w-5 h-5" />
              </h2>
            </div>

            {/* Message */}
            <motion.div
              className="bg-muted/30 rounded-2xl p-6 mb-6 min-h-[120px] flex items-center justify-center"
            >
              <p className="text-center text-lg leading-relaxed">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  |
                </motion.span>
              </p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-4">
              {welcomeMessages.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentMessageIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  animate={idx === currentMessageIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  {currentMessageIndex < welcomeMessages.length - 1 ? 'Next' : "Let's Go!"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
