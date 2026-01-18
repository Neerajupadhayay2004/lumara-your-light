import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Sparkles, Globe, Brain, Heart, Waves, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LumaraMascot } from './LumaraMascot';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

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

interface EnhancedVoiceAgentProps {
  onMessage?: (message: string, response: string) => void;
}

// Therapeutic responses based on detected emotions
const therapeuticResponses: Record<string, Record<Language, string[]>> = {
  anxious: {
    en: [
      "I can sense you're feeling anxious. Let's try a grounding technique together. Take a deep breath with me.",
      "Anxiety can feel overwhelming. Remember, you've faced difficult moments before and come through. You're stronger than you know.",
      "When anxiety rises, focus on this moment. Name 5 things you can see, 4 you can touch, 3 you can hear. I'm right here with you."
    ],
    hi: [
      "मुझे लगता है आप चिंतित हैं। आइए साथ में एक ग्राउंडिंग तकनीक आज़माएं। मेरे साथ गहरी सांस लें।",
      "चिंता भारी लग सकती है। याद रखें, आपने पहले भी कठिन पलों का सामना किया है। आप अपनी सोच से ज़्यादा मज़बूत हैं।",
      "जब चिंता बढ़े, इस पल पर ध्यान दें। 5 चीज़ें जो आप देख सकते हैं, 4 छू सकते हैं, 3 सुन सकते हैं। मैं यहीं हूं।"
    ],
    es: [
      "Puedo sentir que estás ansioso. Intentemos una técnica de arraigo juntos. Respira profundo conmigo.",
      "La ansiedad puede ser abrumadora. Recuerda que has enfrentado momentos difíciles antes. Eres más fuerte de lo que crees.",
      "Cuando la ansiedad aumenta, concéntrate en este momento. Nombra 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes oír."
    ],
    fr: [
      "Je sens que vous êtes anxieux. Essayons une technique d'ancrage ensemble. Respirez profondément avec moi.",
      "L'anxiété peut sembler accablante. N'oubliez pas que vous avez surmonté des moments difficiles avant. Vous êtes plus fort que vous ne le pensez.",
      "Quand l'anxiété monte, concentrez-vous sur ce moment. Nommez 5 choses que vous voyez, 4 que vous touchez, 3 que vous entendez."
    ],
    de: [
      "Ich spüre, dass Sie ängstlich sind. Versuchen wir gemeinsam eine Erdungstechnik. Atmen Sie tief mit mir ein.",
      "Angst kann überwältigend sein. Denken Sie daran, Sie haben schwierige Momente zuvor gemeistert. Sie sind stärker als Sie denken.",
      "Wenn die Angst steigt, konzentrieren Sie sich auf diesen Moment. Nennen Sie 5 Dinge, die Sie sehen, 4 die Sie berühren können."
    ]
  },
  sad: {
    en: [
      "I hear the sadness in your voice. It's okay to feel this way. Your feelings are valid and important.",
      "Sadness is a natural part of being human. Allow yourself to feel it. I'm here to listen without judgment.",
      "When you're ready, we can explore what's weighing on your heart. For now, just know you're not alone in this."
    ],
    hi: [
      "मैं आपकी आवाज़ में उदासी सुन सकता हूं। ऐसा महसूस करना ठीक है। आपकी भावनाएं मान्य और महत्वपूर्ण हैं।",
      "उदासी मनुष्य होने का स्वाभाविक हिस्सा है। खुद को महसूस करने दें। मैं बिना किसी निर्णय के सुनने के लिए यहां हूं।",
      "जब आप तैयार हों, हम जान सकते हैं कि आपके दिल पर क्या भार है। अभी के लिए, जान लें कि आप अकेले नहीं हैं।"
    ],
    es: [
      "Escucho la tristeza en tu voz. Está bien sentirse así. Tus sentimientos son válidos e importantes.",
      "La tristeza es una parte natural de ser humano. Permítete sentirla. Estoy aquí para escuchar sin juzgar.",
      "Cuando estés listo, podemos explorar lo que pesa en tu corazón. Por ahora, solo sé que no estás solo."
    ],
    fr: [
      "J'entends la tristesse dans votre voix. C'est normal de se sentir ainsi. Vos sentiments sont valides et importants.",
      "La tristesse fait partie de la nature humaine. Permettez-vous de la ressentir. Je suis là pour écouter sans jugement.",
      "Quand vous serez prêt, nous pourrons explorer ce qui pèse sur votre cœur. Pour l'instant, sachez que vous n'êtes pas seul."
    ],
    de: [
      "Ich höre die Traurigkeit in Ihrer Stimme. Es ist okay, so zu fühlen. Ihre Gefühle sind berechtigt und wichtig.",
      "Traurigkeit ist ein natürlicher Teil des Menschseins. Erlauben Sie sich, sie zu fühlen. Ich bin hier, um zuzuhören.",
      "Wenn Sie bereit sind, können wir erkunden, was auf Ihrem Herzen lastet. Wissen Sie, dass Sie nicht allein sind."
    ]
  },
  stressed: {
    en: [
      "It sounds like you're carrying a heavy load. Let's pause and take three slow breaths together.",
      "Stress can make everything feel urgent. But right now, in this moment, you're safe. Let's focus on one thing at a time.",
      "Your body holds onto stress. Try rolling your shoulders and releasing that tension. I'm here to help you find calm."
    ],
    hi: [
      "ऐसा लगता है आप भारी बोझ उठा रहे हैं। चलिए रुकें और साथ में तीन धीमी सांसें लें।",
      "तनाव सब कुछ जरूरी महसूस करा सकता है। लेकिन अभी, इस पल में, आप सुरक्षित हैं। एक समय में एक चीज़ पर ध्यान दें।",
      "आपका शरीर तनाव को पकड़े रहता है। अपने कंधों को घुमाएं और तनाव छोड़ें। मैं आपको शांति खोजने में मदद के लिए हूं।"
    ],
    es: [
      "Parece que llevas una carga pesada. Hagamos una pausa y tomemos tres respiraciones lentas juntos.",
      "El estrés puede hacer que todo parezca urgente. Pero ahora mismo, en este momento, estás a salvo.",
      "Tu cuerpo retiene el estrés. Intenta rodar los hombros y liberar esa tensión. Estoy aquí para ayudarte."
    ],
    fr: [
      "On dirait que vous portez une lourde charge. Faisons une pause et prenons trois respirations lentes ensemble.",
      "Le stress peut tout faire paraître urgent. Mais en ce moment, vous êtes en sécurité. Concentrons-nous sur une chose à la fois.",
      "Votre corps retient le stress. Essayez de rouler vos épaules et de libérer cette tension. Je suis là pour vous aider."
    ],
    de: [
      "Es klingt, als trügen Sie eine schwere Last. Lass uns pausieren und drei langsame Atemzüge zusammen nehmen.",
      "Stress kann alles dringend erscheinen lassen. Aber jetzt, in diesem Moment, sind Sie sicher. Konzentrieren wir uns auf eines.",
      "Ihr Körper hält Stress fest. Versuchen Sie, Ihre Schultern zu rollen und die Spannung zu lösen. Ich bin hier, um zu helfen."
    ]
  },
  happy: {
    en: [
      "I can hear the joy in your voice! That's wonderful. Let's celebrate this positive moment together.",
      "Your happiness is contagious! It's beautiful to hear you feeling good. What's bringing you joy today?",
      "This is a beautiful moment. Savoring happiness helps it last longer. I'm so glad you're feeling well!"
    ],
    hi: [
      "मैं आपकी आवाज़ में खुशी सुन सकता हूं! यह अद्भुत है। चलिए इस सकारात्मक पल को साथ मनाएं।",
      "आपकी खुशी संक्रामक है! आपको अच्छा महसूस करते सुनकर खुशी हुई। आज आपको क्या खुश कर रहा है?",
      "यह एक सुंदर पल है। खुशी का आनंद लेने से यह लंबे समय तक रहती है। मुझे खुशी है कि आप अच्छा महसूस कर रहे हैं!"
    ],
    es: [
      "¡Puedo escuchar la alegría en tu voz! Eso es maravilloso. Celebremos este momento positivo juntos.",
      "¡Tu felicidad es contagiosa! Es hermoso escucharte sentir bien. ¿Qué te trae alegría hoy?",
      "Este es un momento hermoso. Saborear la felicidad la hace durar más. ¡Me alegra que te sientas bien!"
    ],
    fr: [
      "J'entends la joie dans votre voix! C'est merveilleux. Célébrons ce moment positif ensemble.",
      "Votre bonheur est contagieux! C'est beau de vous entendre vous sentir bien. Qu'est-ce qui vous apporte de la joie?",
      "C'est un beau moment. Savourer le bonheur le fait durer plus longtemps. Je suis ravi que vous vous sentiez bien!"
    ],
    de: [
      "Ich kann die Freude in Ihrer Stimme hören! Das ist wunderbar. Lass uns diesen positiven Moment zusammen feiern.",
      "Ihre Glücklichkeit ist ansteckend! Es ist schön zu hören, dass Sie sich gut fühlen. Was bringt Ihnen heute Freude?",
      "Das ist ein schöner Moment. Das Genießen von Glück lässt es länger dauern. Ich freue mich, dass es Ihnen gut geht!"
    ]
  },
  default: {
    en: [
      "I'm here to listen. Take your time and share what's on your mind.",
      "Thank you for sharing with me. Your thoughts and feelings matter.",
      "I appreciate you opening up. How can I best support you right now?"
    ],
    hi: [
      "मैं सुनने के लिए यहां हूं। अपना समय लें और बताएं कि आपके मन में क्या है।",
      "मेरे साथ साझा करने के लिए धन्यवाद। आपके विचार और भावनाएं मायने रखती हैं।",
      "खुलकर बात करने के लिए धन्यवाद। मैं अभी आपकी सबसे अच्छी मदद कैसे कर सकता हूं?"
    ],
    es: [
      "Estoy aquí para escuchar. Tómate tu tiempo y comparte lo que tienes en mente.",
      "Gracias por compartir conmigo. Tus pensamientos y sentimientos importan.",
      "Aprecio que te abras. ¿Cómo puedo apoyarte mejor ahora mismo?"
    ],
    fr: [
      "Je suis là pour écouter. Prenez votre temps et partagez ce que vous avez en tête.",
      "Merci de partager avec moi. Vos pensées et sentiments comptent.",
      "J'apprécie que vous vous ouvriez. Comment puis-je vous soutenir au mieux maintenant?"
    ],
    de: [
      "Ich bin hier, um zuzuhören. Nehmen Sie sich Zeit und teilen Sie, was Sie beschäftigt.",
      "Danke, dass Sie mir mitteilen. Ihre Gedanken und Gefühle sind wichtig.",
      "Ich schätze es, dass Sie sich öffnen. Wie kann ich Sie jetzt am besten unterstützen?"
    ]
  }
};

// Language to speech recognition language code mapping
const languageToSpeechCode: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE'
};

// Voice selection per language
const getVoiceForLanguage = (lang: Language): SpeechSynthesisVoice | null => {
  const voices = speechSynthesis.getVoices();
  const langCode = languageToSpeechCode[lang].split('-')[0];
  
  // Preferred voices for each language
  const preferredVoices: Record<string, string[]> = {
    en: ['Samantha', 'Google UK English Female', 'Microsoft Aria', 'Google US English'],
    hi: ['Google हिन्दी', 'Lekha', 'Microsoft Swara'],
    es: ['Monica', 'Google español', 'Microsoft Helena'],
    fr: ['Amélie', 'Google français', 'Microsoft Julie'],
    de: ['Anna', 'Google Deutsch', 'Microsoft Katja']
  };

  // Try to find preferred voice
  for (const name of preferredVoices[langCode] || []) {
    const voice = voices.find(v => v.name.includes(name));
    if (voice) return voice;
  }

  // Fallback to any voice matching the language
  return voices.find(v => v.lang.startsWith(langCode)) || null;
};

// Emotion detection keywords per language
const emotionKeywords: Record<string, Record<Language, string[]>> = {
  anxious: {
    en: ['anxious', 'worried', 'nervous', 'panic', 'scared', 'fear', 'overwhelmed', 'anxiety'],
    hi: ['चिंतित', 'परेशान', 'डर', 'घबराहट', 'भय', 'तनाव'],
    es: ['ansioso', 'preocupado', 'nervioso', 'pánico', 'miedo', 'temor'],
    fr: ['anxieux', 'inquiet', 'nerveux', 'panique', 'peur', 'angoisse'],
    de: ['ängstlich', 'besorgt', 'nervös', 'panik', 'angst', 'furcht']
  },
  sad: {
    en: ['sad', 'depressed', 'down', 'crying', 'unhappy', 'miserable', 'grief', 'lonely'],
    hi: ['उदास', 'दुखी', 'रो रहा', 'अकेला', 'निराश', 'दर्द'],
    es: ['triste', 'deprimido', 'llorando', 'infeliz', 'solo', 'dolor'],
    fr: ['triste', 'déprimé', 'pleure', 'malheureux', 'seul', 'chagrin'],
    de: ['traurig', 'deprimiert', 'weinen', 'unglücklich', 'einsam', 'schmerz']
  },
  stressed: {
    en: ['stressed', 'pressure', 'exhausted', 'burnout', 'tired', 'overwhelmed', 'busy'],
    hi: ['तनाव', 'थका', 'दबाव', 'व्यस्त', 'परेशान'],
    es: ['estresado', 'presión', 'agotado', 'cansado', 'ocupado'],
    fr: ['stressé', 'pression', 'épuisé', 'fatigué', 'débordé'],
    de: ['gestresst', 'druck', 'erschöpft', 'müde', 'überfordert']
  },
  happy: {
    en: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'good', 'better'],
    hi: ['खुश', 'खुशी', 'अच्छा', 'बेहतर', 'मज़ा'],
    es: ['feliz', 'alegría', 'emocionado', 'genial', 'maravilloso'],
    fr: ['heureux', 'joie', 'excité', 'super', 'merveilleux'],
    de: ['glücklich', 'freude', 'aufgeregt', 'toll', 'wunderbar']
  }
};

export const EnhancedVoiceAgent = ({ onMessage }: EnhancedVoiceAgentProps) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [detectedEmotion, setDetectedEmotion] = useState<string>('neutral');
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'calm' | 'listening' | 'thinking' | 'speaking' | 'concerned'>('calm');
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesLoaded(true);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, []);

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
        recognitionRef.current.lang = languageToSpeechCode[language];
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      speechSynthesis.cancel();
    };
  }, []);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languageToSpeechCode[language];
    }
  }, [language]);

  const detectEmotion = useCallback((text: string): string => {
    const lowerText = text.toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const langKeywords = keywords[language] || keywords.en;
      if (langKeywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }
    return 'default';
  }, [language]);

  const getAIResponse = useCallback(async (userText: string): Promise<string> => {
    const emotion = detectEmotion(userText);
    setDetectedEmotion(emotion);

    // First, try local therapeutic responses for immediate feedback
    const responses = therapeuticResponses[emotion]?.[language] || therapeuticResponses.default[language];
    const localResponse = responses[Math.floor(Math.random() * responses.length)];

    // Then try to get AI-enhanced response
    try {
      const newHistory = [...conversationHistory, { role: 'user', content: userText }];
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lumara-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          userMessage: userText
        }),
      });

      if (!response.ok || !response.body) {
        return localResponse;
      }

      // Stream the response
      let aiResponse = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIdx;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIdx).trim();
          buffer = buffer.slice(newlineIdx + 1);
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) aiResponse += delta;
          } catch {}
        }
      }

      if (aiResponse) {
        setConversationHistory([...newHistory, { role: 'assistant', content: aiResponse }]);
        return aiResponse;
      }
      return localResponse;
    } catch {
      return localResponse;
    }
  }, [conversationHistory, detectEmotion, language]);

  const speakText = useCallback((text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get appropriate voice for language
    const voice = getVoiceForLanguage(language);
    if (voice) utterance.voice = voice;
    
    utterance.lang = languageToSpeechCode[language];
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setMascotEmotion('speaking');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setMascotEmotion('calm');
    };
    
    speechSynthesis.speak(utterance);
  }, [isMuted, language]);

  const processUserInput = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    setMascotEmotion('thinking');
    
    const response = await getAIResponse(text);
    setResponseText(response);
    
    setIsProcessing(false);
    speakText(response);
    
    onMessage?.(text, response);
  }, [getAIResponse, speakText, onMessage]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setMascotEmotion('thinking');
      
      // Process the captured text
      if (currentText.trim()) {
        processUserInput(currentText);
      }
    } else {
      speechSynthesis.cancel();
      setCurrentText('');
      setResponseText('');
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setCurrentText(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (currentText.trim()) {
          setMascotEmotion('thinking');
        } else {
          setMascotEmotion('calm');
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setMascotEmotion('concerned');
      };
      
      recognitionRef.current.start();
      setIsListening(true);
      setMascotEmotion('listening');
    }
  }, [isListening, currentText, processUserInput]);

  const getEmotionIcon = () => {
    switch (detectedEmotion) {
      case 'anxious': return <Waves className="w-4 h-4" />;
      case 'sad': return <Heart className="w-4 h-4" />;
      case 'stressed': return <Zap className="w-4 h-4" />;
      case 'happy': return <Sparkles className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getEmotionColor = () => {
    switch (detectedEmotion) {
      case 'anxious': return 'text-blue-400';
      case 'sad': return 'text-indigo-400';
      case 'stressed': return 'text-amber-400';
      case 'happy': return 'text-green-400';
      default: return 'text-primary';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-gradient-gold flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Lumara Voice AI
        </h3>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
      </div>

      {/* Mascot */}
      <div className="flex justify-center mb-6">
        <motion.div
          animate={{
            scale: isListening ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
        >
          <LumaraMascot size="xl" emotion={mascotEmotion} />
        </motion.div>
      </div>

      {/* Emotion indicator */}
      <AnimatePresence>
        {detectedEmotion !== 'neutral' && detectedEmotion !== 'default' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center gap-2 mb-4 ${getEmotionColor()}`}
          >
            {getEmotionIcon()}
            <span className="text-sm capitalize">Sensing: {detectedEmotion}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text display */}
      <div className="space-y-3 mb-6">
        {/* User speech */}
        <motion.div 
          className="bg-muted/30 rounded-2xl p-4 min-h-[60px] flex items-center justify-center"
          animate={{ borderColor: isListening ? 'hsl(var(--primary))' : 'transparent' }}
          style={{ borderWidth: 2 }}
        >
          <AnimatePresence mode="wait">
            {currentText ? (
              <motion.p 
                key="text" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center text-sm"
              >
                {currentText}
              </motion.p>
            ) : (
              <motion.p 
                key="placeholder"
                className="text-center text-sm text-muted-foreground"
              >
                {isListening ? '🎤 Listening...' : isProcessing ? '🧠 Processing...' : 'Tap the mic to speak'}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* AI response */}
        <AnimatePresence>
          {responseText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-primary/10 border border-primary/20 rounded-2xl p-4"
            >
              <p className="text-sm leading-relaxed">{responseText}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMuted(!isMuted)}
          className="rounded-full"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        
        <motion.button
          onClick={toggleListening}
          disabled={isProcessing}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center shadow-lg
            transition-all duration-300
            ${isListening 
              ? 'bg-red-500 shadow-red-500/30' 
              : isProcessing
                ? 'bg-amber-500 shadow-amber-500/30'
                : 'bg-gradient-to-br from-primary to-primary-glow shadow-primary/30'
            }
          `}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </motion.button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            const responses = therapeuticResponses.default[language];
            const text = responses[Math.floor(Math.random() * responses.length)];
            setResponseText(text);
            speakText(text);
          }}
          className="rounded-full"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>

      {/* Listening indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex justify-center gap-1"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{
                  height: [12, 24, 12],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        💛 I'm here to listen. Your feelings matter.
      </p>
    </motion.div>
  );
};
