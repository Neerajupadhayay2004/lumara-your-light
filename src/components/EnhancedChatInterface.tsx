import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, Brain, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LumaraMascot } from './LumaraMascot';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: string;
}

interface EnhancedChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  detectedEmotion?: string;
}

// Suggested prompts based on emotion and language
const suggestedPrompts: Record<string, Record<Language, string[]>> = {
  default: {
    en: [
      "I need someone to talk to",
      "I'm feeling overwhelmed today",
      "Can you help me relax?",
      "Tell me something positive"
    ],
    hi: [
      "मुझे किसी से बात करनी है",
      "आज मैं बहुत परेशान महसूस कर रहा हूं",
      "क्या आप मुझे आराम करने में मदद कर सकते हैं?",
      "कुछ अच्छा बताइए"
    ],
    es: [
      "Necesito hablar con alguien",
      "Me siento abrumado hoy",
      "¿Puedes ayudarme a relajarme?",
      "Dime algo positivo"
    ],
    fr: [
      "J'ai besoin de parler à quelqu'un",
      "Je me sens submergé aujourd'hui",
      "Peux-tu m'aider à me détendre?",
      "Dis-moi quelque chose de positif"
    ],
    de: [
      "Ich brauche jemanden zum Reden",
      "Ich fühle mich heute überfordert",
      "Kannst du mir helfen zu entspannen?",
      "Sag mir etwas Positives"
    ]
  },
  anxious: {
    en: [
      "I'm having anxiety right now",
      "Help me with breathing exercises",
      "I can't stop worrying",
      "My heart is racing"
    ],
    hi: [
      "मुझे अभी चिंता हो रही है",
      "सांस लेने की कसरत में मदद करें",
      "मैं चिंता करना बंद नहीं कर पा रहा",
      "मेरा दिल तेज़ी से धड़क रहा है"
    ],
    es: [
      "Estoy teniendo ansiedad ahora",
      "Ayúdame con ejercicios de respiración",
      "No puedo dejar de preocuparme",
      "Mi corazón late muy rápido"
    ],
    fr: [
      "J'ai de l'anxiété en ce moment",
      "Aide-moi avec des exercices de respiration",
      "Je n'arrive pas à arrêter de m'inquiéter",
      "Mon cœur bat très vite"
    ],
    de: [
      "Ich habe gerade Angst",
      "Hilf mir bei Atemübungen",
      "Ich kann nicht aufhören mir Sorgen zu machen",
      "Mein Herz rast"
    ]
  },
  sad: {
    en: [
      "I'm feeling really down",
      "I feel like crying",
      "Nothing seems to matter",
      "I need some comfort"
    ],
    hi: [
      "मैं बहुत उदास महसूस कर रहा हूं",
      "मेरा रोने का मन है",
      "कुछ भी मायने नहीं रखता",
      "मुझे थोड़ी सांत्वना चाहिए"
    ],
    es: [
      "Me siento muy triste",
      "Tengo ganas de llorar",
      "Nada parece importar",
      "Necesito un poco de consuelo"
    ],
    fr: [
      "Je me sens vraiment déprimé",
      "J'ai envie de pleurer",
      "Rien ne semble avoir d'importance",
      "J'ai besoin de réconfort"
    ],
    de: [
      "Ich fühle mich wirklich niedergeschlagen",
      "Ich möchte weinen",
      "Nichts scheint zu zählen",
      "Ich brauche etwas Trost"
    ]
  }
};

// Language to speech code
const languageToSpeechCode: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE'
};

export const EnhancedChatInterface = ({ 
  messages, 
  onSendMessage, 
  isLoading,
  detectedEmotion = 'default'
}: EnhancedChatInterfaceProps) => {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) setShowSuggestions(false);
  }, [messages.length]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = languageToSpeechCode[language];
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };
      
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language]);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    setShowSuggestions(false);
  }, [input, isLoading, onSendMessage]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = languageToSpeechCode[language];
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, language]);

  const speakMessage = useCallback((messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    if (speakingMessageId === messageId) {
      speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageToSpeechCode[language];
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      utterance.onend = () => setSpeakingMessageId(null);
      setSpeakingMessageId(messageId);
      speechSynthesis.speak(utterance);
    }
  }, [speakingMessageId, language]);

  const copyMessage = useCallback(async (messageId: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedMessageId(null), 2000);
  }, []);

  const getMascotEmotion = (): 'happy' | 'calm' | 'listening' | 'thinking' | 'speaking' | 'concerned' => {
    if (isLoading) return 'thinking';
    if (isListening) return 'listening';
    if (speakingMessageId) return 'speaking';
    if (detectedEmotion === 'sad' || detectedEmotion === 'anxious') return 'concerned';
    if (messages.length === 0) return 'happy';
    return 'calm';
  };

  const currentSuggestions = suggestedPrompts[detectedEmotion]?.[language] || suggestedPrompts.default[language];

  return (
    <div className="flex flex-col h-full bg-gradient-calm rounded-3xl overflow-hidden border border-border/30">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <LumaraMascot size="sm" emotion={getMascotEmotion()} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-foreground">Lumara</h3>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? '✨ Thinking with care...' : isListening ? '🎤 Listening...' : 'Your companion is here'}
          </p>
        </div>
        {detectedEmotion && detectedEmotion !== 'default' && detectedEmotion !== 'neutral' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20"
          >
            <Heart className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary capitalize">{detectedEmotion}</span>
          </motion.div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <LumaraMascot size="lg" emotion="happy" className="mx-auto mb-4" />
            <p className="text-lg font-display text-foreground mb-2">
              Hello! I'm Lumara 💛
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              I'm here to listen without judgment. How are you feeling?
            </p>
            
            {/* Quick suggestions */}
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-2"
              >
                {currentSuggestions.map((prompt, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    onClick={() => {
                      setInput(prompt);
                      textareaRef.current?.focus();
                    }}
                    className="px-3 py-2 text-sm bg-card/60 hover:bg-card border border-border/30 hover:border-primary/30 rounded-xl transition-all"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
        
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.02 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  group max-w-[85%] rounded-2xl px-4 py-3 relative
                  ${message.role === 'user'
                    ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground rounded-br-sm'
                    : 'bg-card border border-border/50 rounded-bl-sm'
                  }
                `}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                
                {/* Message actions */}
                {message.role === 'assistant' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute -bottom-8 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      onClick={() => speakMessage(message.id, message.content)}
                      className="p-1.5 rounded-lg bg-card border border-border/30 hover:border-primary/30 transition-colors"
                      title="Listen"
                    >
                      {speakingMessageId === message.id ? (
                        <VolumeX className="w-3 h-3 text-primary" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => copyMessage(message.id, message.content)}
                      className="p-1.5 rounded-lg bg-card border border-border/30 hover:border-primary/30 transition-colors"
                      title="Copy"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="flex gap-2 items-end">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleListening}
            className="shrink-0 rounded-xl"
          >
            {isListening ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                <MicOff className="w-4 h-4" />
              </motion.div>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Share how you're feeling..."
            className="min-h-[44px] max-h-[120px] resize-none bg-background border-border/50 focus:border-primary rounded-xl"
          />
          
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💛 I'm here to support, not replace professional help.
        </p>
      </div>
    </div>
  );
};
