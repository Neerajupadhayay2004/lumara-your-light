import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Play, Pause, Volume2, VolumeX, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Story {
  id: string;
  title: string;
  duration: string;
  category: string;
  icon: string;
  color: string;
  content: string[];
}

const stories: Story[] = [
  {
    id: 'moonlight-meadow',
    title: 'The Moonlight Meadow',
    duration: '8 min',
    category: 'Nature',
    icon: '🌙',
    color: 'from-indigo-400 to-purple-500',
    content: [
      "As night falls gently over the meadow, a soft silver light bathes everything in peaceful glow.",
      "The tall grasses sway like waves in a gentle ocean, creating a soothing rhythm.",
      "Fireflies begin their nightly dance, tiny lanterns floating through the warm summer air.",
      "In the distance, an owl calls softly, a lullaby for the sleeping forest.",
      "The cool night breeze carries the sweet scent of wildflowers, wrapping around you like a blanket.",
      "Each breath you take brings you deeper into this peaceful place.",
      "The stars above twinkle like diamonds scattered across velvet sky.",
      "As you drift deeper into relaxation, the meadow holds you safe and warm.",
    ],
  },
  {
    id: 'ocean-dreams',
    title: 'Ocean Dreams',
    duration: '10 min',
    category: 'Water',
    icon: '🌊',
    color: 'from-cyan-400 to-blue-500',
    content: [
      "Picture yourself on a peaceful beach at twilight, the sand still warm beneath you.",
      "Gentle waves roll in and out, creating nature's most soothing rhythm.",
      "The salty air fills your lungs as seabirds call their evening songs.",
      "Each wave that touches the shore carries away your worries and stress.",
      "The horizon glows with the last golden light of day.",
      "Dolphins play in the distance, their silhouettes dancing against the sunset.",
      "As darkness falls, the ocean continues its gentle lullaby.",
      "You are safe, you are calm, you are at peace.",
    ],
  },
  {
    id: 'forest-whispers',
    title: 'Forest Whispers',
    duration: '12 min',
    category: 'Nature',
    icon: '🌲',
    color: 'from-green-400 to-emerald-500',
    content: [
      "Deep in an ancient forest, sunlight filters through the canopy like golden rain.",
      "The soft carpet of moss cushions every step on this peaceful path.",
      "Birds sing their afternoon songs, a chorus of joy and contentment.",
      "A gentle stream bubbles nearby, its crystal waters reflecting the light.",
      "The scent of pine and earth fills the air with natural comfort.",
      "Ancient trees stand as gentle guardians, their branches swaying softly.",
      "With each breath, you absorb the peace and wisdom of this sacred place.",
      "The forest whispers that you are exactly where you need to be.",
    ],
  },
  {
    id: 'starlight-journey',
    title: 'Starlight Journey',
    duration: '15 min',
    category: 'Space',
    icon: '⭐',
    color: 'from-violet-400 to-purple-600',
    content: [
      "Imagine floating gently among the stars, weightless and free.",
      "The universe stretches endlessly around you, filled with wonder and light.",
      "Distant galaxies spiral in patterns of cosmic beauty.",
      "You are connected to everything, a part of this infinite tapestry.",
      "Stars twinkle like old friends, welcoming you to this peaceful realm.",
      "Time moves differently here, each moment stretching into gentle eternity.",
      "The silence of space wraps around you like the softest blanket.",
      "In this vastness, you find the deepest peace within yourself.",
    ],
  },
];

export const SleepStories = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([70]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!selectedStory || !isPlaying) return;

    const paragraph = selectedStory.content[currentParagraph];
    if (!paragraph) {
      setIsPlaying(false);
      return;
    }

    // Type out the text
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < paragraph.length) {
        setDisplayedText(paragraph.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 40);

    // Speak the text
    if (!isMuted && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(paragraph);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      utterance.volume = volume[0] / 100;
      
      utterance.onend = () => {
        if (currentParagraph < selectedStory.content.length - 1) {
          setTimeout(() => setCurrentParagraph(prev => prev + 1), 2000);
        } else {
          setIsPlaying(false);
        }
      };
      
      utteranceRef.current = utterance;
      setTimeout(() => speechSynthesis.speak(utterance), 500);
    } else {
      // Auto advance without speech
      setTimeout(() => {
        if (currentParagraph < selectedStory.content.length - 1) {
          setCurrentParagraph(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 8000);
    }

    return () => {
      clearInterval(typeInterval);
      speechSynthesis.cancel();
    };
  }, [selectedStory, isPlaying, currentParagraph, isMuted, volume]);

  const startStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentParagraph(0);
    setDisplayedText('');
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const closeStory = () => {
    speechSynthesis.cancel();
    setSelectedStory(null);
    setIsPlaying(false);
    setCurrentParagraph(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30"
    >
      <h3 className="font-display text-lg font-semibold text-gradient-gold mb-4 flex items-center gap-2">
        <Moon className="w-5 h-5" />
        Sleep Stories
      </h3>

      {!selectedStory ? (
        <div className="grid gap-4">
          {stories.map((story) => (
            <motion.button
              key={story.id}
              onClick={() => startStory(story)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all text-left group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${story.color} flex items-center justify-center text-2xl`}>
                {story.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{story.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{story.category}</span>
                  <span>•</span>
                  <span>{story.duration}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Story header */}
          <div className={`bg-gradient-to-br ${selectedStory.color} rounded-2xl p-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedStory.icon}</span>
                <div>
                  <h4 className="text-xl font-bold">{selectedStory.title}</h4>
                  <p className="text-sm opacity-80">{selectedStory.category} • {selectedStory.duration}</p>
                </div>
              </div>
            </div>
            
            {/* Stars animation */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Story content */}
          <div className="bg-muted/20 rounded-2xl p-6 min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentParagraph}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg leading-relaxed text-center"
              >
                {displayedText}
                {isPlaying && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-2">
            {selectedStory.content.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx <= currentParagraph ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            
            <Button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-glow"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>
            
            <Button variant="ghost" onClick={closeStory}>
              Close
            </Button>
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
