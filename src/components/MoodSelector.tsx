import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { LumaraMascot } from './LumaraMascot';
import { MessageCircle, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MoodOption {
  emoji: string;
  labelKey: string;
  emotion: string;
  color: string;
}

const moods: MoodOption[] = [
  { emoji: '😊', labelKey: 'happy', emotion: 'happy', color: 'bg-emotion-happy' },
  { emoji: '😌', labelKey: 'calm', emotion: 'calm', color: 'bg-emotion-calm' },
  { emoji: '😰', labelKey: 'anxious', emotion: 'anxious', color: 'bg-emotion-anxious' },
  { emoji: '😢', labelKey: 'sad', emotion: 'sad', color: 'bg-emotion-sad' },
  { emoji: '😤', labelKey: 'stressed', emotion: 'stressed', color: 'bg-emotion-stressed' },
  { emoji: '😠', labelKey: 'angry', emotion: 'angry', color: 'bg-emotion-angry' },
  { emoji: '😔', labelKey: 'lonely', emotion: 'lonely', color: 'bg-emotion-lonely' },
  { emoji: '🌟', labelKey: 'hopeful', emotion: 'hopeful', color: 'bg-emotion-hopeful' },
  { emoji: '😐', labelKey: 'neutral', emotion: 'neutral', color: 'bg-emotion-neutral' },
  { emoji: '😵', labelKey: 'overwhelmed', emotion: 'overwhelmed', color: 'bg-emotion-overwhelmed' },
];

interface MoodSelectorProps {
  onSubmit: (data: { emoji: string; emotion: string; intensity: number; journalNote?: string }) => void;
  isLoading?: boolean;
}

const getMascotEmotion = (emotion: string): 'happy' | 'calm' | 'thinking' | 'speaking' | 'concerned' => {
  switch (emotion) {
    case 'happy':
    case 'hopeful':
      return 'happy';
    case 'calm':
    case 'neutral':
      return 'calm';
    case 'anxious':
    case 'stressed':
    case 'overwhelmed':
      return 'concerned';
    case 'sad':
    case 'lonely':
      return 'thinking';
    case 'angry':
      return 'concerned';
    default:
      return 'calm';
  }
};

export const MoodSelector = ({ onSubmit, isLoading }: MoodSelectorProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [intensity, setIntensity] = useState([5]);
  const [journalNote, setJournalNote] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Typing animation effect
  useEffect(() => {
    if (!showResponse || !responseText) return;
    
    let index = 0;
    setDisplayedText('');
    
    const typingInterval = setInterval(() => {
      if (index < responseText.length) {
        setDisplayedText(responseText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [showResponse, responseText]);

  // Text-to-speech effect
  useEffect(() => {
    if (!showResponse || !responseText || isMuted) return;
    
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(responseText);
    
    // Set language based on current language
    const langMap: { [key: string]: string } = {
      en: 'en-US',
      hi: 'hi-IN',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
    };
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synth.speak(utterance);

    return () => synth.cancel();
  }, [showResponse, responseText, language, isMuted]);

  // Countdown and redirect effect
  useEffect(() => {
    if (!showResponse) return;
    
    const countdownInterval = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate('/chat');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showResponse, navigate]);

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    // Get the mood response translation key
    const responseKey = `moodResponse${selectedMood.emotion.charAt(0).toUpperCase() + selectedMood.emotion.slice(1)}`;
    const response = t(responseKey);
    
    onSubmit({
      emoji: selectedMood.emoji,
      emotion: selectedMood.emotion,
      intensity: intensity[0],
      journalNote: journalNote || undefined,
    });
    
    setResponseText(response);
    setShowResponse(true);
    setRedirectCountdown(5);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const goToChatNow = () => {
    window.speechSynthesis.cancel();
    navigate('/chat');
  };

  if (showResponse && selectedMood) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center py-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <LumaraMascot 
            size="xl" 
            emotion={isSpeaking ? 'speaking' : getMascotEmotion(selectedMood.emotion)} 
            className="mx-auto"
          />
        </motion.div>

        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="rounded-full"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary-glow/5 rounded-3xl p-6 max-w-lg mx-auto border border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">{selectedMood.emoji}</span>
            <span className="text-lg font-medium text-muted-foreground">
              {t(selectedMood.labelKey)}
            </span>
          </div>
          
          <p className="text-lg md:text-xl font-display text-foreground leading-relaxed min-h-[80px]">
            {displayedText}
            {displayedText.length < responseText.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle"
              />
            )}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <p className="text-muted-foreground text-sm">
            {t('redirectingToChat')} ({redirectCountdown}s)
          </p>
          
          <Button
            onClick={goToChatNow}
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            size="lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {t('letsChat')}
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-display text-xl font-semibold text-foreground">
          {t('howAreYouFeeling')}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t('selectEmotion')}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.emotion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedMood(mood)}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300
              ${selectedMood?.emotion === mood.emotion 
                ? `${mood.color} shadow-glow scale-110` 
                : 'bg-card hover:bg-secondary/50 hover:scale-105'
              }
            `}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs font-medium">{t(mood.labelKey)}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 pt-4"
          >
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                {t('intensity')}: <span className="text-lumara-gold font-bold">{intensity[0]}/10</span>
              </label>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('mild')}</span>
                <span>{t('intense')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t('journalNote')}
              </label>
              <Textarea
                placeholder={t('journalPlaceholder')}
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                className="min-h-[100px] resize-none bg-card border-border/50 focus:border-lumara-gold"
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              variant="hero"
              size="lg"
              className="w-full"
            >
              {isLoading ? t('saving') : t('logMyMood')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
