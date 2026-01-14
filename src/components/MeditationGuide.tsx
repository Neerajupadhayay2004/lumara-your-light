import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, Moon, Sun, Leaf, Heart, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Meditation {
  id: string;
  title: string;
  duration: number;
  icon: React.ReactNode;
  color: string;
  steps: string[];
  description: string;
}

const meditations: Meditation[] = [
  {
    id: 'body-scan',
    title: 'Body Scan Relaxation',
    duration: 300,
    icon: <Heart className="w-5 h-5" />,
    color: 'from-rose-400 to-pink-500',
    description: 'Release tension from head to toe',
    steps: [
      "Find a comfortable position and close your eyes...",
      "Take a deep breath in... and slowly exhale...",
      "Bring your attention to the top of your head...",
      "Notice any tension in your forehead... let it melt away...",
      "Relax your eyes... your cheeks... your jaw...",
      "Feel your neck and shoulders softening...",
      "Let your arms feel heavy and relaxed...",
      "Breathe into your chest... feel it expand...",
      "Relax your stomach... your lower back...",
      "Feel your hips... your thighs... releasing...",
      "Your knees... calves... ankles...",
      "All the way down to your toes...",
      "Your whole body is now deeply relaxed...",
      "Rest here in this peaceful state...",
      "When you're ready, slowly open your eyes..."
    ]
  },
  {
    id: 'loving-kindness',
    title: 'Loving-Kindness',
    duration: 240,
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-amber-400 to-orange-500',
    description: 'Cultivate compassion and love',
    steps: [
      "Sit comfortably and breathe deeply...",
      "Picture yourself surrounded by golden light...",
      "Repeat silently: May I be happy...",
      "May I be healthy...",
      "May I be safe...",
      "May I live with ease...",
      "Now think of someone you love...",
      "May they be happy... healthy... safe...",
      "Extend this to someone neutral...",
      "Now to someone difficult...",
      "Finally, to all beings everywhere...",
      "May all beings be happy and free..."
    ]
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    duration: 180,
    icon: <Leaf className="w-5 h-5" />,
    color: 'from-green-400 to-emerald-500',
    description: 'Come back to the present moment',
    steps: [
      "Take a slow, deep breath...",
      "Look around and name 5 things you can SEE...",
      "A color... a shape... something small...",
      "Now notice 4 things you can TOUCH...",
      "The texture of your clothes... the ground beneath you...",
      "Listen for 3 things you can HEAR...",
      "Near sounds... distant sounds...",
      "Notice 2 things you can SMELL...",
      "Finally, 1 thing you can TASTE...",
      "You are here. You are present. You are safe."
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep Preparation',
    duration: 360,
    icon: <Moon className="w-5 h-5" />,
    color: 'from-indigo-400 to-purple-500',
    description: 'Drift into peaceful sleep',
    steps: [
      "Lie down comfortably...",
      "Close your eyes and breathe slowly...",
      "Imagine you're in a peaceful meadow at dusk...",
      "The sky is painted with soft colors...",
      "Feel the gentle breeze on your skin...",
      "Stars begin to appear one by one...",
      "Each breath takes you deeper into relaxation...",
      "Your body feels heavier... softer...",
      "The world grows quiet around you...",
      "You are safe... you are calm...",
      "Drift now into peaceful dreams...",
      "Sleep comes easily and naturally..."
    ]
  },
  {
    id: 'morning',
    title: 'Morning Intention',
    duration: 180,
    icon: <Sun className="w-5 h-5" />,
    color: 'from-yellow-400 to-orange-400',
    description: 'Start your day with clarity',
    steps: [
      "Take a moment before rising...",
      "Breathe in fresh morning energy...",
      "Set an intention for today...",
      "What quality do you want to embody?",
      "Kindness... patience... courage...",
      "Visualize your day unfolding smoothly...",
      "You have everything you need within you...",
      "Take three energizing breaths...",
      "Open your eyes with gratitude...",
      "You are ready for this beautiful day."
    ]
  },
  {
    id: 'anxiety-relief',
    title: 'Anxiety Relief',
    duration: 240,
    icon: <Brain className="w-5 h-5" />,
    color: 'from-cyan-400 to-blue-500',
    description: 'Calm racing thoughts',
    steps: [
      "Find a comfortable position...",
      "Place one hand on your heart, one on your belly...",
      "Breathe in for 4 counts...",
      "Hold gently for 4 counts...",
      "Exhale slowly for 6 counts...",
      "Repeat this calming rhythm...",
      "Your thoughts are just clouds passing...",
      "You don't have to hold onto them...",
      "Let them drift by...",
      "Return to your breath...",
      "You are safe in this moment...",
      "Nothing needs to be solved right now..."
    ]
  }
];

export const MeditationGuide = () => {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation>(meditations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < selectedMeditation.steps.length) {
      const stepDuration = (selectedMeditation.duration / selectedMeditation.steps.length) * 1000;
      
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= selectedMeditation.steps.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, stepDuration);

      // Update time remaining
      const timeInterval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(timeInterval);
      };
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, selectedMeditation]);

  const startMeditation = () => {
    setCurrentStep(0);
    setTimeRemaining(selectedMeditation.duration);
    setIsPlaying(true);
    
    // Speak the first step
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(selectedMeditation.steps[0]);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      speechSynthesis.cancel();
    } else if (currentStep === 0) {
      startMeditation();
    } else {
      setIsPlaying(true);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeRemaining(0);
    speechSynthesis.cancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Speak current step when it changes
  useEffect(() => {
    if (isPlaying && currentStep > 0) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(selectedMeditation.steps[currentStep]);
        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        speechSynthesis.speak(utterance);
      }
    }
  }, [currentStep, isPlaying, selectedMeditation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30"
    >
      <h3 className="font-display text-lg font-semibold text-gradient-gold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        Guided Meditations
      </h3>

      {/* Meditation Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        {meditations.map((meditation) => (
          <motion.button
            key={meditation.id}
            onClick={() => {
              setSelectedMeditation(meditation);
              reset();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-xl text-left transition-all ${
              selectedMeditation.id === meditation.id 
                ? 'bg-primary/20 border-2 border-primary/40' 
                : 'bg-muted/30 border-2 border-transparent hover:bg-muted/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meditation.color} text-white flex items-center justify-center mb-2`}>
              {meditation.icon}
            </div>
            <p className="text-sm font-medium">{meditation.title}</p>
            <p className="text-xs text-muted-foreground">{Math.floor(meditation.duration / 60)} min</p>
          </motion.button>
        ))}
      </div>

      {/* Current Meditation Display */}
      <motion.div 
        className={`bg-gradient-to-br ${selectedMeditation.color} rounded-2xl p-6 mb-4 text-white relative overflow-hidden`}
        layoutId="meditation-display"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {selectedMeditation.icon}
              <span className="font-bold">{selectedMeditation.title}</span>
            </div>
            {isPlaying && (
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {formatTime(timeRemaining)}
              </span>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg leading-relaxed min-h-[60px]"
            >
              {isPlaying ? selectedMeditation.steps[currentStep] : selectedMeditation.description}
            </motion.p>
          </AnimatePresence>

          {/* Progress */}
          {isPlaying && (
            <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-white/60 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep + 1) / selectedMeditation.steps.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={reset} className="text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-glow hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>
      </div>
    </motion.div>
  );
};
