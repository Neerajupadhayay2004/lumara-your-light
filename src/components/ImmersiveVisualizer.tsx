import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Sparkles, Waves, Circle, Snowflake, 
  Volume2, VolumeX, Maximize2, Minimize2, Palette, 
  Mic, MicOff, RotateCcw, Settings2, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LumaraMascot } from './LumaraMascot';
import { useLanguage } from '@/contexts/LanguageContext';

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
  onerror: ((event: Event) => void) | null;
}

type VisualizerType = 'aurora' | 'waves' | 'orbs' | 'particles' | 'cosmos' | 'fireflies';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  opacity: number;
}

const visualizerOptions: { type: VisualizerType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'aurora', label: 'Aurora Borealis', icon: <Sparkles className="w-5 h-5" />, description: 'Mesmerizing northern lights' },
  { type: 'waves', label: 'Ocean Waves', icon: <Waves className="w-5 h-5" />, description: 'Calming sea motion' },
  { type: 'orbs', label: 'Energy Orbs', icon: <Circle className="w-5 h-5" />, description: 'Floating energy spheres' },
  { type: 'particles', label: 'Particle Field', icon: <Snowflake className="w-5 h-5" />, description: 'Gentle particle dance' },
  { type: 'cosmos', label: 'Cosmic Journey', icon: <Zap className="w-5 h-5" />, description: 'Deep space exploration' },
  { type: 'fireflies', label: 'Firefly Garden', icon: <Sparkles className="w-5 h-5" />, description: 'Magical firefly night' },
];

const colorThemes = [
  { name: 'Sunset', colors: ['hsl(42, 95%, 55%)', 'hsl(25, 90%, 65%)', 'hsl(350, 80%, 60%)'] },
  { name: 'Ocean', colors: ['hsl(200, 70%, 60%)', 'hsl(180, 60%, 50%)', 'hsl(220, 80%, 55%)'] },
  { name: 'Forest', colors: ['hsl(150, 60%, 55%)', 'hsl(120, 50%, 45%)', 'hsl(80, 60%, 50%)'] },
  { name: 'Lavender', colors: ['hsl(270, 50%, 70%)', 'hsl(290, 60%, 60%)', 'hsl(250, 70%, 65%)'] },
  { name: 'Aurora', colors: ['hsl(160, 80%, 50%)', 'hsl(200, 90%, 60%)', 'hsl(280, 70%, 65%)'] },
];

const voiceResponses: Record<string, string[]> = {
  calm: [
    "I sense you're seeking peace. Let me adjust the visuals to be more soothing.",
    "Take a deep breath. I'm creating a calming atmosphere just for you.",
    "Relaxation mode activated. Let the gentle colors wash over you."
  ],
  energize: [
    "Let's add some energy! Watch as the particles come alive.",
    "Energizing your space with vibrant motion and color.",
    "Feel the energy flowing through these dynamic visuals."
  ],
  focus: [
    "Creating a focused environment. Let the patterns guide your concentration.",
    "Minimal distractions, maximum clarity. Focus mode enabled.",
    "Your mind is clear. These visuals will help maintain your focus."
  ],
  sleep: [
    "Preparing you for restful sleep. The visuals are becoming softer.",
    "Let these gentle movements guide you to peaceful slumber.",
    "Nighttime mode activated. Sweet dreams are coming."
  ],
  default: [
    "I'm here to support you. How can I adjust the experience?",
    "Tell me what you need, and I'll create the perfect atmosphere.",
    "Your wellness is my priority. What would help you right now?"
  ]
};

export const ImmersiveVisualizer = () => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [visualizerType, setVisualizerType] = useState<VisualizerType>('aurora');
  const [intensity, setIntensity] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [colorTheme, setColorTheme] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'calm' | 'listening' | 'thinking' | 'speaking'>('calm');
  const [aiResponse, setAiResponse] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const animationRef = useRef<number>();
  
  const colors = colorThemes[colorTheme].colors;

  // Generate particles based on intensity
  useEffect(() => {
    const particleCount = Math.floor(intensity[0] / 3) + 20;
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 0.5,
      angle: Math.random() * 360,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(newParticles);
  }, [intensity, colorTheme]);

  // Initialize speech recognition
  useEffect(() => {
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
        
        // Set language based on context
        const langMap: Record<string, string> = {
          en: 'en-US',
          hi: 'hi-IN',
          es: 'es-ES',
          fr: 'fr-FR',
          de: 'de-DE',
        };
        recognitionRef.current.lang = langMap[language] || 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setVoiceText(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setMascotEmotion('thinking');
          if (voiceText) {
            processVoiceCommand(voiceText);
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [language]);

  const processVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    let responseCategory = 'default';
    
    // Detect intent from voice
    if (lowerText.includes('calm') || lowerText.includes('relax') || lowerText.includes('peace') || lowerText.includes('शांत') || lowerText.includes('relajar')) {
      responseCategory = 'calm';
      setVisualizerType('waves');
      setIntensity([30]);
    } else if (lowerText.includes('energy') || lowerText.includes('active') || lowerText.includes('ऊर्जा') || lowerText.includes('energía')) {
      responseCategory = 'energize';
      setVisualizerType('particles');
      setIntensity([80]);
    } else if (lowerText.includes('focus') || lowerText.includes('concentrate') || lowerText.includes('ध्यान') || lowerText.includes('enfoque')) {
      responseCategory = 'focus';
      setVisualizerType('orbs');
      setIntensity([40]);
    } else if (lowerText.includes('sleep') || lowerText.includes('rest') || lowerText.includes('नींद') || lowerText.includes('dormir')) {
      responseCategory = 'sleep';
      setVisualizerType('fireflies');
      setIntensity([20]);
    } else if (lowerText.includes('aurora') || lowerText.includes('northern')) {
      setVisualizerType('aurora');
    } else if (lowerText.includes('ocean') || lowerText.includes('wave') || lowerText.includes('समुद्र')) {
      setVisualizerType('waves');
    } else if (lowerText.includes('cosmos') || lowerText.includes('space') || lowerText.includes('अंतरिक्ष')) {
      setVisualizerType('cosmos');
    } else if (lowerText.includes('play') || lowerText.includes('start')) {
      setIsPlaying(true);
    } else if (lowerText.includes('pause') || lowerText.includes('stop')) {
      setIsPlaying(false);
    }
    
    // Generate response
    const responses = voiceResponses[responseCategory];
    const response = responses[Math.floor(Math.random() * responses.length)];
    setAiResponse(response);
    speakText(response);
  };

  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    // Try to use a voice matching the language
    const voices = speechSynthesis.getVoices();
    const langMap: Record<string, string> = {
      en: 'en',
      hi: 'hi',
      es: 'es',
      fr: 'fr',
      de: 'de',
    };
    const langPrefix = langMap[language] || 'en';
    const preferredVoice = voices.find(v => v.lang.startsWith(langPrefix) && v.name.includes('Female'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => { setMascotEmotion('speaking'); };
    utterance.onend = () => { setMascotEmotion('calm'); setTimeout(() => setAiResponse(''), 3000); };
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
      setVoiceText('');
      setAiResponse('');
      recognitionRef.current.start();
      setIsListening(true);
      setMascotEmotion('listening');
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Render visualizer based on type
  const renderVisualizer = () => {
    const baseClass = "absolute inset-0 overflow-hidden";
    
    switch (visualizerType) {
      case 'aurora':
        return (
          <div className={baseClass}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at ${20 + i * 12}% ${40 + (i % 2) * 25}%, ${colors[i % colors.length]}40 0%, transparent 50%)`,
                  filter: 'blur(60px)',
                }}
                animate={isPlaying ? {
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.3, 1],
                  x: [-30, 30, -30],
                  rotate: [0, 5, 0],
                } : { opacity: 0.5 }}
                transition={{
                  duration: 5 + i * 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.6,
                }}
              />
            ))}
            {/* Stars */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 70}%`,
                }}
                animate={isPlaying ? {
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.5, 0.8],
                } : { opacity: 0.3 }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        );

      case 'waves':
        return (
          <div className={baseClass}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${30 + i * 10}%`,
                  background: `linear-gradient(180deg, transparent 0%, ${colors[i % colors.length]}30 50%, ${colors[i % colors.length]}50 100%)`,
                  borderRadius: '50% 50% 0 0',
                  transformOrigin: 'bottom',
                }}
                animate={isPlaying ? {
                  y: [0, -20 - i * 5, 0],
                  scaleX: [1, 1.05, 1],
                  scaleY: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />
            ))}
            {/* Foam bubbles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full bg-white/30"
                style={{
                  width: 4 + Math.random() * 8,
                  height: 4 + Math.random() * 8,
                  left: `${Math.random() * 100}%`,
                  bottom: `${20 + Math.random() * 30}%`,
                }}
                animate={isPlaying ? {
                  y: [0, -50, 0],
                  opacity: [0, 0.8, 0],
                } : {}}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        );

      case 'orbs':
        return (
          <div className={baseClass} style={{ perspective: '1000px' }}>
            {/* Central orb */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
                boxShadow: isPlaying ? `0 0 80px ${colors[0]}, 0 0 160px ${colors[0]}50` : `0 0 40px ${colors[0]}30`,
              }}
              animate={isPlaying ? {
                scale: [1, 1.15, 1],
                rotate: [0, 180, 360],
              } : { scale: 1 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            {/* Orbiting rings */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full border-2"
                style={{
                  width: 200 + i * 80,
                  height: 200 + i * 80,
                  marginLeft: -(100 + i * 40),
                  marginTop: -(100 + i * 40),
                  borderColor: `${colors[i % colors.length]}40`,
                }}
                animate={isPlaying ? { rotate: i % 2 === 0 ? [0, 360] : [360, 0] } : {}}
                transition={{
                  duration: 15 + i * 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 12 + i * 4,
                    height: 12 + i * 4,
                    background: colors[i % colors.length],
                    boxShadow: `0 0 20px ${colors[i % colors.length]}`,
                    top: -6 - i * 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                  animate={isPlaying ? { scale: [0.8, 1.3, 0.8] } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              </motion.div>
            ))}
          </div>
        );

      case 'particles':
        return (
          <div className={baseClass}>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  filter: 'blur(1px)',
                }}
                animate={isPlaying ? {
                  y: [0, -40 - particle.speed * 20, 0],
                  x: [-15, 15, -15],
                  opacity: [particle.opacity, particle.opacity + 0.3, particle.opacity],
                  scale: [1, 1.2, 1],
                } : { opacity: particle.opacity * 0.5 }}
                transition={{
                  duration: particle.speed * 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: particle.id * 0.05,
                }}
              />
            ))}
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              {particles.slice(0, 10).map((p1, i) =>
                particles.slice(i + 1, i + 4).map((p2, j) => (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke={colors[0]}
                    strokeWidth="0.5"
                    animate={isPlaying ? { opacity: [0.1, 0.4, 0.1] } : {}}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))
              )}
            </svg>
          </div>
        );

      case 'cosmos':
        return (
          <div className={baseClass}>
            {/* Nebula clouds */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`nebula-${i}`}
                className="absolute"
                style={{
                  width: '60%',
                  height: '60%',
                  background: `radial-gradient(ellipse, ${colors[i % colors.length]}30 0%, transparent 70%)`,
                  left: `${10 + i * 15}%`,
                  top: `${10 + (i % 3) * 25}%`,
                  filter: 'blur(40px)',
                }}
                animate={isPlaying ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: [0, 10, 0],
                } : {}}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 1.5,
                }}
              />
            ))}
            {/* Stars */}
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 1 + Math.random() * 3,
                  height: 1 + Math.random() * 3,
                  background: i % 5 === 0 ? colors[i % colors.length] : 'white',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: i % 5 === 0 ? `0 0 10px ${colors[i % colors.length]}` : 'none',
                }}
                animate={isPlaying ? {
                  opacity: [0.3, 1, 0.3],
                  scale: i % 5 === 0 ? [1, 1.5, 1] : [1, 1.2, 1],
                } : {}}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
            {/* Shooting star */}
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ boxShadow: '0 0 10px white, -50px 0 30px white' }}
              initial={{ left: '100%', top: '10%', opacity: 0 }}
              animate={isPlaying ? {
                left: ['-10%'],
                top: ['60%'],
                opacity: [0, 1, 0],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 8,
              }}
            />
          </div>
        );

      case 'fireflies':
        return (
          <div className={baseClass}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
            {/* Fireflies */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 4 + Math.random() * 6,
                  height: 4 + Math.random() * 6,
                  background: colors[i % colors.length],
                  boxShadow: `0 0 ${10 + Math.random() * 10}px ${colors[i % colors.length]}, 0 0 ${20 + Math.random() * 15}px ${colors[i % colors.length]}50`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={isPlaying ? {
                  x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 50, 0],
                  y: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 40, 0],
                  opacity: [0.2, 1, 0.5, 0.2],
                  scale: [0.8, 1.2, 0.9, 0.8],
                } : { opacity: 0.3 }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 3,
                }}
              />
            ))}
            {/* Grass silhouettes */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
          </div>
        );
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative bg-background rounded-3xl overflow-hidden border border-border/30 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video md:aspect-[21/9]'
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isListening && setShowControls(false)}
    >
      {/* Visualizer */}
      <div className="absolute inset-0">
        {renderVisualizer()}
      </div>

      {/* Voice interaction overlay */}
      <AnimatePresence>
        {(isListening || aiResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          >
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-4 border border-border/30 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <LumaraMascot size="sm" emotion={mascotEmotion} />
                <div className="flex-1">
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-4 bg-primary rounded-full"
                            animate={{ scaleY: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">Listening...</span>
                    </motion.div>
                  )}
                  {voiceText && <p className="text-sm font-medium">{voiceText}</p>}
                </div>
              </div>
              {aiResponse && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground border-t border-border/30 pt-2 mt-2"
                >
                  {aiResponse}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center justify-between bg-gradient-to-b from-background/80 to-transparent">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-display font-semibold text-sm md:text-base">Immersive Visualizer</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-8 w-8 md:h-9 md:w-9"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 md:h-9 md:w-9"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Center play/pause */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-card/60 backdrop-blur-xl border border-border/30 flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 md:w-8 md:h-8" />
                ) : (
                  <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" />
                )}
              </motion.button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-background/80 to-transparent">
              {/* Visualizer type selector */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                {visualizerOptions.map((option) => (
                  <motion.button
                    key={option.type}
                    onClick={() => setVisualizerType(option.type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs md:text-sm transition-all ${
                      visualizerType === option.type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card/60 backdrop-blur-xl border border-border/30 hover:border-primary/30'
                    }`}
                  >
                    {option.icon}
                    <span className="hidden sm:inline">{option.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Controls row */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {/* Intensity slider */}
                <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-xs">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>

                {/* Color theme */}
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    {colorThemes.map((theme, idx) => (
                      <motion.button
                        key={theme.name}
                        onClick={() => setColorTheme(idx)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${
                          colorTheme === idx ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
                        }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Voice control */}
                <motion.button
                  onClick={toggleListening}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span className="hidden md:inline">{isListening ? 'Stop' : 'Voice Control'}</span>
                </motion.button>

                {/* Reset */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setVisualizerType('aurora');
                    setIntensity([50]);
                    setColorTheme(0);
                  }}
                  className="h-8 w-8 md:h-9 md:w-9"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
