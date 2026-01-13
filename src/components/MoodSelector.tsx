import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface MoodOption {
  emoji: string;
  label: string;
  emotion: string;
  color: string;
}

const moods: MoodOption[] = [
  { emoji: '😊', label: 'Happy', emotion: 'happy', color: 'bg-emotion-happy' },
  { emoji: '😌', label: 'Calm', emotion: 'calm', color: 'bg-emotion-calm' },
  { emoji: '😰', label: 'Anxious', emotion: 'anxious', color: 'bg-emotion-anxious' },
  { emoji: '😢', label: 'Sad', emotion: 'sad', color: 'bg-emotion-sad' },
  { emoji: '😤', label: 'Stressed', emotion: 'stressed', color: 'bg-emotion-stressed' },
  { emoji: '😠', label: 'Angry', emotion: 'angry', color: 'bg-emotion-angry' },
  { emoji: '😔', label: 'Lonely', emotion: 'lonely', color: 'bg-emotion-lonely' },
  { emoji: '🌟', label: 'Hopeful', emotion: 'hopeful', color: 'bg-emotion-hopeful' },
  { emoji: '😐', label: 'Neutral', emotion: 'neutral', color: 'bg-emotion-neutral' },
  { emoji: '😵', label: 'Overwhelmed', emotion: 'overwhelmed', color: 'bg-emotion-overwhelmed' },
];

interface MoodSelectorProps {
  onSubmit: (data: { emoji: string; emotion: string; intensity: number; journalNote?: string }) => void;
  isLoading?: boolean;
}

export const MoodSelector = ({ onSubmit, isLoading }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [intensity, setIntensity] = useState([5]);
  const [journalNote, setJournalNote] = useState('');

  const handleSubmit = () => {
    if (!selectedMood) return;
    onSubmit({
      emoji: selectedMood.emoji,
      emotion: selectedMood.emotion,
      intensity: intensity[0],
      journalNote: journalNote || undefined,
    });
    setSelectedMood(null);
    setIntensity([5]);
    setJournalNote('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-display text-xl font-semibold text-foreground">
          How are you feeling right now?
        </h3>
        <p className="text-muted-foreground text-sm">
          Select the emotion that best describes your current state
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
            <span className="text-xs font-medium">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6 pt-4"
        >
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Intensity: <span className="text-lumara-gold font-bold">{intensity[0]}/10</span>
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
              <span>Mild</span>
              <span>Intense</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Journal note (optional)
            </label>
            <Textarea
              placeholder="What's on your mind? Feel free to share..."
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
            {isLoading ? 'Saving...' : 'Log My Mood'}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
