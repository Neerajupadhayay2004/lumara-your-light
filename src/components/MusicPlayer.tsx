import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Waves, TreePine, Cloud, Moon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Track {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  frequency?: number;
  description: string;
}

const tracks: Track[] = [
  { id: 'rain', name: 'Gentle Rain', category: 'Nature', icon: <Cloud className="w-5 h-5" />, color: 'from-blue-400 to-blue-600', description: 'Soft rainfall for relaxation' },
  { id: 'ocean', name: 'Ocean Waves', category: 'Nature', icon: <Waves className="w-5 h-5" />, color: 'from-cyan-400 to-teal-600', description: 'Calming ocean sounds' },
  { id: 'forest', name: 'Forest Ambience', category: 'Nature', icon: <TreePine className="w-5 h-5" />, color: 'from-green-400 to-emerald-600', description: 'Birds and gentle breeze' },
  { id: 'night', name: 'Night Crickets', category: 'Nature', icon: <Moon className="w-5 h-5" />, color: 'from-indigo-400 to-purple-600', description: 'Peaceful night sounds' },
  { id: 'meditation', name: 'Meditation Bells', category: 'Music', icon: <Music className="w-5 h-5" />, color: 'from-amber-400 to-orange-500', description: 'Tibetan singing bowls' },
  { id: 'heartbeat', name: 'Calm Heartbeat', category: 'Body', icon: <Heart className="w-5 h-5" />, color: 'from-rose-400 to-pink-600', description: 'Grounding rhythm' },
];

// Generate ambient audio using Web Audio API
const createAmbientSound = (type: string, audioContext: AudioContext): OscillatorNode | null => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  switch (type) {
    case 'rain':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      break;
    case 'ocean':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
      break;
    case 'forest':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      break;
    case 'night':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      break;
    case 'meditation':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(432, audioContext.currentTime); // Healing frequency
      break;
    case 'heartbeat':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
      break;
    default:
      return null;
  }
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  return oscillator;
};

export const MusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Create more complex sound based on track type
    switch (currentTrack.id) {
      case 'rain':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        // Add noise-like modulation
        const lfoRain = audioContext.createOscillator();
        lfoRain.frequency.setValueAtTime(0.5, audioContext.currentTime);
        const lfoGainRain = audioContext.createGain();
        lfoGainRain.gain.setValueAtTime(50, audioContext.currentTime);
        lfoRain.connect(lfoGainRain);
        lfoGainRain.connect(oscillator.frequency);
        lfoRain.start();
        break;
      case 'ocean':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        // Wave-like modulation
        const lfoOcean = audioContext.createOscillator();
        lfoOcean.frequency.setValueAtTime(0.1, audioContext.currentTime);
        const lfoGainOcean = audioContext.createGain();
        lfoGainOcean.gain.setValueAtTime(30, audioContext.currentTime);
        lfoOcean.connect(lfoGainOcean);
        lfoGainOcean.connect(oscillator.frequency);
        lfoOcean.start();
        break;
      case 'forest':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        // Bird-like chirps
        const lfoForest = audioContext.createOscillator();
        lfoForest.frequency.setValueAtTime(3, audioContext.currentTime);
        const lfoGainForest = audioContext.createGain();
        lfoGainForest.gain.setValueAtTime(200, audioContext.currentTime);
        lfoForest.connect(lfoGainForest);
        lfoGainForest.connect(oscillator.frequency);
        lfoForest.start();
        break;
      case 'night':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
        // Cricket-like sound
        const lfoNight = audioContext.createOscillator();
        lfoNight.frequency.setValueAtTime(10, audioContext.currentTime);
        const lfoGainNight = audioContext.createGain();
        lfoGainNight.gain.setValueAtTime(100, audioContext.currentTime);
        lfoNight.connect(lfoGainNight);
        lfoGainNight.connect(oscillator.frequency);
        lfoNight.start();
        break;
      case 'meditation':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, audioContext.currentTime); // 432Hz healing frequency
        break;
      case 'heartbeat':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
        // Heartbeat rhythm
        const lfoHeart = audioContext.createOscillator();
        lfoHeart.frequency.setValueAtTime(1, audioContext.currentTime);
        const lfoGainHeart = audioContext.createGain();
        lfoGainHeart.gain.setValueAtTime(0.5, audioContext.currentTime);
        lfoHeart.connect(lfoGainHeart);
        lfoGainHeart.connect(gainNode.gain);
        lfoHeart.start();
        break;
    }

    const vol = isMuted ? 0 : volume[0] / 500;
    gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    
    oscillator.start();
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSound();
    } else {
      playSound();
    }
  };

  const handleTrackChange = (track: Track) => {
    setCurrentTrack(track);
    if (isPlaying) {
      stopSound();
      setTimeout(() => playSound(), 100);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (gainNodeRef.current && audioContextRef.current) {
      const vol = isMuted ? 0 : newVolume[0] / 500;
      gainNodeRef.current.gain.setValueAtTime(vol, audioContextRef.current.currentTime);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (gainNodeRef.current && audioContextRef.current) {
      const vol = !isMuted ? 0 : volume[0] / 500;
      gainNodeRef.current.gain.setValueAtTime(vol, audioContextRef.current.currentTime);
    }
  };

  const nextTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handleTrackChange(tracks[nextIndex]);
  };

  const prevTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handleTrackChange(tracks[prevIndex]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30"
    >
      <h3 className="font-display text-lg font-semibold text-gradient-gold mb-4 flex items-center gap-2">
        <Music className="w-5 h-5" />
        Calming Sounds
      </h3>

      {/* Current Track Display */}
      <motion.div 
        className={`bg-gradient-to-br ${currentTrack.color} rounded-2xl p-6 mb-6 text-white relative overflow-hidden`}
        layoutId="player-bg"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            {currentTrack.icon}
            <span className="text-sm opacity-80">{currentTrack.category}</span>
          </div>
          <h4 className="text-xl font-bold mb-1">{currentTrack.name}</h4>
          <p className="text-sm opacity-70">{currentTrack.description}</p>
        </div>
        
        {/* Animated waves when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 right-4 flex gap-1"
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white/60 rounded-full"
                  animate={{
                    height: [8, 20, 8],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={prevTrack} className="text-muted-foreground hover:text-foreground">
          <SkipBack className="w-5 h-5" />
        </Button>
        <Button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-glow hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={nextTrack} className="text-muted-foreground hover:text-foreground">
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={toggleMute} className="text-muted-foreground">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        <Slider
          value={volume}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>

      {/* Track List */}
      <div className="grid grid-cols-2 gap-2">
        {tracks.map((track) => (
          <motion.button
            key={track.id}
            onClick={() => handleTrackChange(track)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-xl text-left transition-all ${
              currentTrack.id === track.id 
                ? 'bg-primary/20 border-2 border-primary/40' 
                : 'bg-muted/30 border-2 border-transparent hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${track.color} text-white`}>
                {track.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{track.name}</p>
                <p className="text-xs text-muted-foreground">{track.category}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
