import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreathingExerciseProps {
  onComplete?: () => void;
}

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const phaseConfig = {
  inhale: { duration: 4000, label: 'Breathe In', scale: 1.3 },
  hold: { duration: 4000, label: 'Hold', scale: 1.3 },
  exhale: { duration: 6000, label: 'Breathe Out', scale: 1 },
};

export const BreathingExercise = ({ onComplete }: BreathingExerciseProps) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const sequence = ['inhale', 'hold', 'exhale'] as const;
    let currentIndex = 0;

    const runPhase = () => {
      const currentPhase = sequence[currentIndex];
      setPhase(currentPhase);
      setCountdown(Math.ceil(phaseConfig[currentPhase].duration / 1000));

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        currentIndex++;
        
        if (currentIndex >= sequence.length) {
          currentIndex = 0;
          setCycles((prev) => {
            const newCycles = prev + 1;
            if (newCycles >= 3) {
              setIsActive(false);
              setPhase('idle');
              onComplete?.();
              return 0;
            }
            return newCycles;
          });
        }
        
        if (isActive) {
          runPhase();
        }
      }, phaseConfig[currentPhase].duration);
    };

    runPhase();

    return () => {
      setPhase('idle');
    };
  }, [isActive, onComplete]);

  const handleStart = () => {
    setIsActive(true);
    setCycles(0);
  };

  const handlePause = () => {
    setIsActive(false);
    setPhase('idle');
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('idle');
    setCycles(0);
    setCountdown(0);
  };

  const getCircleScale = () => {
    if (phase === 'idle') return 1;
    return phaseConfig[phase].scale;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <h3 className="font-display text-2xl font-semibold text-center">
        4-4-6 Breathing Exercise
      </h3>
      
      <p className="text-muted-foreground text-center max-w-sm">
        This calming technique helps reduce anxiety and stress. 
        Complete 3 cycles to feel more relaxed.
      </p>

      {/* Breathing circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-lumara-gold/20 blur-2xl"
          animate={{
            scale: getCircleScale(),
            opacity: phase === 'idle' ? 0.2 : 0.4,
          }}
          transition={{ duration: phase === 'idle' ? 0.3 : phaseConfig[phase]?.duration / 1000 || 0.3 }}
        />
        
        {/* Main circle */}
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-lumara-gold to-accent shadow-glow"
          animate={{
            scale: getCircleScale(),
          }}
          transition={{ 
            duration: phase === 'idle' ? 0.3 : phaseConfig[phase]?.duration / 1000 || 0.3,
            ease: 'easeInOut'
          }}
        />
        
        {/* Inner circle */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-card flex items-center justify-center"
          animate={{
            scale: getCircleScale() * 0.9,
          }}
          transition={{ 
            duration: phase === 'idle' ? 0.3 : phaseConfig[phase]?.duration / 1000 || 0.3,
            ease: 'easeInOut'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              {phase === 'idle' ? (
                <span className="text-lg font-display font-medium text-muted-foreground">Ready</span>
              ) : (
                <>
                  <div className="text-3xl font-display font-bold text-lumara-gold">
                    {countdown}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {phaseConfig[phase].label}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cycle indicator */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < cycles ? 'bg-lumara-gold' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isActive ? (
          <Button onClick={handleStart} variant="hero" size="lg">
            <Play className="w-5 h-5 mr-2" />
            Start Breathing
          </Button>
        ) : (
          <Button onClick={handlePause} variant="outline" size="lg">
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        )}
        
        {(isActive || cycles > 0) && (
          <Button onClick={handleReset} variant="ghost" size="lg">
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
