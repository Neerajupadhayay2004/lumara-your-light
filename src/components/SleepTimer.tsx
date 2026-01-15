import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Clock, X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SleepTimerProps {
  onTimerEnd: () => void;
  isPlaying: boolean;
}

const presetTimes = [5, 10, 15, 30, 45, 60, 90];

export const SleepTimer = ({ onTimerEnd, isPlaying }: SleepTimerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            setIsActive(false);
            onTimerEnd();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimerEnd]);

  const startTimer = useCallback(() => {
    setTimeLeft(selectedMinutes * 60);
    setIsActive(true);
    setIsOpen(false);
  }, [selectedMinutes]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(null);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Timer button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          isActive 
            ? 'bg-primary/20 text-primary border border-primary/40' 
            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
        }`}
      >
        <Moon className="w-4 h-4" />
        {isActive && timeLeft !== null ? (
          <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
        ) : (
          <span className="text-sm">Sleep Timer</span>
        )}
      </motion.button>

      {/* Timer modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-3xl p-6 shadow-xl border border-border/30"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Moon className="w-5 h-5 text-primary" />
                  Sleep Timer
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Timer display */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/30"
                  animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="font-mono text-3xl font-bold text-primary">
                    {isActive && timeLeft !== null 
                      ? formatTime(timeLeft) 
                      : `${selectedMinutes}:00`
                    }
                  </span>
                </motion.div>
              </div>

              {/* Preset times */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {presetTimes.map(time => (
                  <motion.button
                    key={time}
                    onClick={() => setSelectedMinutes(time)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedMinutes === time
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    {time}m
                  </motion.button>
                ))}
              </div>

              {/* Custom slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>5 min</span>
                  <span>120 min</span>
                </div>
                <Slider
                  value={[selectedMinutes]}
                  onValueChange={([value]) => setSelectedMinutes(value)}
                  min={5}
                  max={120}
                  step={5}
                />
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                {isActive ? (
                  <Button 
                    onClick={stopTimer}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                ) : (
                  <Button 
                    onClick={startTimer}
                    className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Timer
                  </Button>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Music will gently fade out when the timer ends 🌙
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
