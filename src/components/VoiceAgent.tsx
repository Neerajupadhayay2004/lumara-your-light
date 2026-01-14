import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LumaraMascot } from './LumaraMascot';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface VoiceAgentProps {
  onMessage?: (message: string) => void;
}

const affirmations = [
  "You are doing better than you think. Every small step counts.",
  "It's okay to take things one moment at a time. You've got this.",
  "Your feelings are valid, and it's brave of you to acknowledge them.",
  "Remember to breathe. You are safe in this moment.",
  "You deserve kindness, especially from yourself.",
  "Progress isn't always linear. Be patient with yourself.",
  "You are stronger than you know. Take a moment to appreciate how far you've come.",
  "It's okay to rest. Your worth isn't measured by your productivity.",
  "You are not alone in this. I'm here with you.",
  "Every storm passes. Brighter days are ahead.",
];

const greetings = [
  "Hello, dear friend. How are you feeling today?",
  "Welcome back. I'm so glad you're here.",
  "Hi there. I'm Lumara, and I'm here to support you.",
];

export const VoiceAgent = ({ onMessage }: VoiceAgentProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'calm' | 'listening' | 'thinking'>('calm');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    setTimeout(() => speakText(greeting), 1000);

    const windowWithSpeech = window as Window & { 
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };

    if (windowWithSpeech.webkitSpeechRecognition || windowWithSpeech.SpeechRecognition) {
      const SpeechRecognitionClass = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        recognitionRef.current = new SpeechRecognitionClass();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setCurrentText(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setMascotEmotion('thinking');
          if (currentText) {
            setTimeout(() => {
              const response = affirmations[Math.floor(Math.random() * affirmations.length)];
              speakText(response);
              onMessage?.(currentText);
            }, 500);
          }
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          setMascotEmotion('calm');
        };
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onstart = () => { setIsSpeaking(true); setMascotEmotion('happy'); setCurrentText(text); };
    utterance.onend = () => { setIsSpeaking(false); setMascotEmotion('calm'); };
    speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setMascotEmotion('calm');
    } else {
      speechSynthesis.cancel();
      setCurrentText('');
      recognitionRef.current.start();
      setIsListening(true);
      setMascotEmotion('listening');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30">
      <h3 className="font-display text-lg font-semibold text-gradient-gold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />Lumara Voice
      </h3>
      <div className="flex justify-center mb-4"><LumaraMascot size="lg" emotion={mascotEmotion} /></div>
      <motion.div className="bg-muted/30 rounded-2xl p-4 mb-4 min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentText ? (
            <motion.p key={currentText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm">{currentText}</motion.p>
          ) : (
            <motion.p className="text-center text-sm text-muted-foreground">{isListening ? 'Listening...' : 'Tap the mic to talk'}</motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</Button>
        <motion.button onClick={toggleListening} whileTap={{ scale: 0.95 }} className={`w-16 h-16 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500' : 'bg-gradient-to-br from-primary to-primary-glow'}`}>
          {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </motion.button>
        <Button variant="ghost" size="icon" onClick={() => speakText(affirmations[Math.floor(Math.random() * affirmations.length)])}><MessageCircle className="w-5 h-5" /></Button>
      </div>
    </motion.div>
  );
};
