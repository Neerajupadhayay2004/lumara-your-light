import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, RefreshCw, Heart, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Affirmation {
  id: number;
  text: string;
  category: string;
  color: string;
}

const affirmations: Affirmation[] = [
  { id: 1, text: "I am worthy of love, peace, and all the good things life has to offer.", category: "Self-Worth", color: "from-rose-400 to-pink-500" },
  { id: 2, text: "Today, I choose to focus on what I can control and let go of what I cannot.", category: "Mindfulness", color: "from-blue-400 to-indigo-500" },
  { id: 3, text: "I am stronger than my challenges and braver than I believe.", category: "Strength", color: "from-amber-400 to-orange-500" },
  { id: 4, text: "My feelings are valid, and it's okay to take time for myself.", category: "Self-Care", color: "from-green-400 to-emerald-500" },
  { id: 5, text: "I am not defined by my past. I am empowered by my present.", category: "Growth", color: "from-purple-400 to-violet-500" },
  { id: 6, text: "Every breath I take fills me with calm and peace.", category: "Peace", color: "from-cyan-400 to-teal-500" },
  { id: 7, text: "I deserve happiness and I allow myself to receive it.", category: "Joy", color: "from-yellow-400 to-amber-500" },
  { id: 8, text: "I am making progress, even when I can't see it.", category: "Progress", color: "from-indigo-400 to-blue-500" },
  { id: 9, text: "My journey is unique, and I trust my path.", category: "Trust", color: "from-pink-400 to-rose-500" },
  { id: 10, text: "I am surrounded by love and support.", category: "Connection", color: "from-teal-400 to-cyan-500" },
  { id: 11, text: "Today is a new opportunity to grow and be grateful.", category: "Gratitude", color: "from-lime-400 to-green-500" },
  { id: 12, text: "I release worry and embrace peace in this moment.", category: "Release", color: "from-violet-400 to-purple-500" },
];

export const DailyAffirmations = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation>(affirmations[0]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    // Get random affirmation on load
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(affirmations[randomIndex]);
  }, []);

  const getNewAffirmation = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * affirmations.length);
    } while (affirmations[newIndex].id === currentAffirmation.id);
    setCurrentAffirmation(affirmations[newIndex]);
  };

  const speakAffirmation = () => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentAffirmation.text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const toggleFavorite = () => {
    if (favorites.includes(currentAffirmation.id)) {
      setFavorites(favorites.filter(id => id !== currentAffirmation.id));
      toast.success('Removed from favorites');
    } else {
      setFavorites([...favorites, currentAffirmation.id]);
      toast.success('Added to favorites 💛');
    }
  };

  const copyAffirmation = () => {
    navigator.clipboard.writeText(currentAffirmation.text);
    toast.success('Copied to clipboard!');
  };

  const favoriteAffirmations = affirmations.filter(a => favorites.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-gradient-gold flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Daily Affirmations
        </h3>
        {favorites.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
            className={showFavorites ? 'text-primary' : ''}
          >
            <Heart className={`w-4 h-4 mr-1 ${showFavorites ? 'fill-current' : ''}`} />
            {favorites.length}
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showFavorites ? (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {favoriteAffirmations.map((affirmation) => (
              <motion.div
                key={affirmation.id}
                whileHover={{ scale: 1.01 }}
                className={`bg-gradient-to-r ${affirmation.color} p-4 rounded-xl text-white cursor-pointer`}
                onClick={() => {
                  setCurrentAffirmation(affirmation);
                  setShowFavorites(false);
                }}
              >
                <p className="text-sm font-medium">{affirmation.text}</p>
              </motion.div>
            ))}
            {favoriteAffirmations.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No favorites yet. Tap the heart to save affirmations!
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={currentAffirmation.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Affirmation card */}
            <motion.div
              className={`bg-gradient-to-br ${currentAffirmation.color} rounded-2xl p-8 text-white relative overflow-hidden`}
              animate={isSpeaking ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
            >
              <div className="absolute inset-0 bg-black/10" />
              
              {/* Sparkle effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}

              <div className="relative z-10">
                <span className="text-xs uppercase tracking-wider opacity-80 mb-3 block">
                  {currentAffirmation.category}
                </span>
                <p className="text-xl md:text-2xl font-display leading-relaxed">
                  "{currentAffirmation.text}"
                </p>
              </div>
            </motion.div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="icon"
                onClick={speakAffirmation}
                className={isSpeaking ? 'text-primary' : ''}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(currentAffirmation.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAffirmation}
              >
                <Copy className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={getNewAffirmation}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Affirmation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
