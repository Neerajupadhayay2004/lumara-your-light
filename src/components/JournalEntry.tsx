import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Save, Trash2, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Entry {
  id: string;
  date: Date;
  mood: string;
  gratitude: string[];
  reflection: string;
  goals: string;
}

const prompts = [
  "What made you smile today?",
  "What are you grateful for right now?",
  "How are you really feeling?",
  "What's one thing you'd like to let go of?",
  "What small win can you celebrate?",
  "How did you show yourself kindness today?",
  "What's something you're looking forward to?",
];

const moodEmojis = ['😊', '😌', '🤔', '😔', '😤', '😰', '🥰', '😴'];

export const JournalEntry = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<Entry>>({
    mood: '😊',
    gratitude: ['', '', ''],
    reflection: '',
    goals: '',
  });
  const [currentPrompt, setCurrentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  const saveEntry = () => {
    if (!currentEntry.reflection?.trim()) {
      toast.error('Please write something in your reflection');
      return;
    }

    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: currentEntry.mood || '😊',
      gratitude: currentEntry.gratitude?.filter(g => g.trim()) || [],
      reflection: currentEntry.reflection || '',
      goals: currentEntry.goals || '',
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry({
      mood: '😊',
      gratitude: ['', '', ''],
      reflection: '',
      goals: '',
    });
    setIsWriting(false);
    toast.success('Journal entry saved! 📝');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast.success('Entry deleted');
  };

  const updateGratitude = (index: number, value: string) => {
    const newGratitude = [...(currentEntry.gratitude || ['', '', ''])];
    newGratitude[index] = value;
    setCurrentEntry({ ...currentEntry, gratitude: newGratitude });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-gradient-gold flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Mindful Journal
        </h3>
        {!isWriting && (
          <Button
            onClick={() => setIsWriting(true)}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            New Entry
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isWriting ? (
          <motion.div
            key="writing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </div>

            {/* Mood selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
              <div className="flex gap-2 flex-wrap">
                {moodEmojis.map((emoji) => (
                  <motion.button
                    key={emoji}
                    onClick={() => setCurrentEntry({ ...currentEntry, mood: emoji })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                      currentEntry.mood === emoji
                        ? 'bg-primary/20 ring-2 ring-primary'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Gratitude */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                3 things I'm grateful for:
              </label>
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  type="text"
                  value={currentEntry.gratitude?.[index] || ''}
                  onChange={(e) => updateGratitude(index, e.target.value)}
                  placeholder={`${index + 1}. Something you appreciate...`}
                  className="w-full px-4 py-2 mb-2 rounded-xl bg-muted/30 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ))}
            </div>

            {/* Reflection with prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Reflection</label>
                <button
                  onClick={() => setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)])}
                  className="text-xs text-primary hover:underline"
                >
                  New prompt
                </button>
              </div>
              <p className="text-sm text-muted-foreground italic mb-2">💭 {currentPrompt}</p>
              <textarea
                value={currentEntry.reflection}
                onChange={(e) => setCurrentEntry({ ...currentEntry, reflection: e.target.value })}
                placeholder="Write your thoughts..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Goals */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tomorrow's intention:</label>
              <input
                type="text"
                value={currentEntry.goals}
                onChange={(e) => setCurrentEntry({ ...currentEntry, goals: e.target.value })}
                placeholder="One thing I'll focus on..."
                className="w-full px-4 py-2 rounded-xl bg-muted/30 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsWriting(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveEntry} className="flex-1 bg-gradient-to-r from-primary to-primary-glow">
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="entries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-2">Your journal is empty</p>
                <p className="text-sm text-muted-foreground">Start writing to track your mental wellness journey</p>
              </div>
            ) : (
              entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all group"
                >
                  <div className="text-3xl">{entry.mood}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {format(entry.date, 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(entry.date, 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {entry.reflection}
                    </p>
                    {entry.gratitude.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {entry.gratitude.slice(0, 3).map((_, i) => (
                          <span key={i} className="text-xs">✨</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
