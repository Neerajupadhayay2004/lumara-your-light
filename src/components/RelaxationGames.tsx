import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, RotateCcw, Trophy, Palette, Grid3X3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const games: Game[] = [
  { id: 'color-match', name: 'Color Calm', description: 'Match soothing colors', icon: <Palette className="w-5 h-5" />, color: 'from-pink-400 to-rose-500' },
  { id: 'memory', name: 'Mindful Memory', description: 'Train your focus', icon: <Grid3X3 className="w-5 h-5" />, color: 'from-blue-400 to-indigo-500' },
  { id: 'breathing-game', name: 'Bubble Pop', description: 'Pop bubbles with breath', icon: <Sparkles className="w-5 h-5" />, color: 'from-cyan-400 to-teal-500' },
];

// Color Match Game Component
const ColorMatchGame = () => {
  const colors = ['#FFB5BA', '#B5D8FF', '#C4F0C5', '#FFE5B5', '#E5B5FF', '#B5FFE5'];
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateRound = useCallback(() => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(target);
    
    const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!shuffled.includes(target)) {
      shuffled[Math.floor(Math.random() * 4)] = target;
    }
    setOptions(shuffled);
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleChoice = (color: string) => {
    if (color === targetColor) {
      setScore(s => s + 1);
      setFeedback('correct');
      setTimeout(generateRound, 500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Match this color:</p>
        <motion.div 
          className="w-20 h-20 rounded-2xl mx-auto shadow-lg"
          style={{ backgroundColor: targetColor }}
          animate={{ scale: feedback === 'correct' ? [1, 1.1, 1] : 1 }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map((color, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleChoice(color)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-16 rounded-xl shadow-md transition-all"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <Trophy className="w-4 h-4 text-amber-500" />
        <span className="font-bold">{score}</span>
      </div>
    </div>
  );
};

// Memory Game Component
const MemoryGame = () => {
  const emojis = ['🌸', '🌿', '🌊', '☀️', '🌙', '⭐', '🦋', '🌈'];
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const initGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, flipped: false, matched: false }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    setCards(cards.map(c => c.id === id ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);
      
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map(c => 
          c.id === first || c.id === second ? { ...c, matched: true } : c
        ));
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, flipped: false } : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const allMatched = cards.every(c => c.matched);

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
              card.flipped || card.matched 
                ? 'bg-primary/20' 
                : 'bg-muted/50 hover:bg-muted'
            }`}
          >
            {(card.flipped || card.matched) ? card.emoji : '?'}
          </motion.button>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Moves: {moves}</span>
        {allMatched && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-primary font-bold"
          >
            🎉 Complete!
          </motion.span>
        )}
        <Button variant="ghost" size="sm" onClick={initGame}>
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
      </div>
    </div>
  );
};

// Bubble Pop Game Component
const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; color: string }[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const colors = ['#FFB5BA', '#B5D8FF', '#C4F0C5', '#FFE5B5', '#E5B5FF'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setBubbles(prev => {
          const newBubble = {
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: 100,
            size: Math.random() * 30 + 20,
            color: colors[Math.floor(Math.random() * colors.length)]
          };
          return [...prev.filter(b => b.y > -20), newBubble].slice(-10);
        });
      }, 800);

      const moveInterval = setInterval(() => {
        setBubbles(prev => prev.map(b => ({ ...b, y: b.y - 5 })));
      }, 100);

      return () => {
        clearInterval(interval);
        clearInterval(moveInterval);
      };
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div className="text-center">
      <div 
        className="relative h-48 bg-gradient-to-b from-blue-100/50 to-blue-200/50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl overflow-hidden mb-4"
      >
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              exit={{ scale: 1.5, opacity: 0 }}
              onClick={() => popBubble(bubble.id)}
              className="absolute rounded-full cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `${bubble.x}%`,
                bottom: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
                backgroundColor: bubble.color,
              }}
            />
          ))}
        </AnimatePresence>
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Click start to play</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="font-bold">{score}</span>
        </div>
        <Button 
          variant={isActive ? "outline" : "default"}
          size="sm" 
          onClick={() => {
            setIsActive(!isActive);
            if (!isActive) {
              setScore(0);
              setBubbles([]);
            }
          }}
        >
          {isActive ? 'Stop' : 'Start'}
        </Button>
      </div>
    </div>
  );
};

export const RelaxationGames = () => {
  const [selectedGame, setSelectedGame] = useState<Game>(games[0]);

  const renderGame = () => {
    switch (selectedGame.id) {
      case 'color-match':
        return <ColorMatchGame />;
      case 'memory':
        return <MemoryGame />;
      case 'breathing-game':
        return <BubblePopGame />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30"
    >
      <h3 className="font-display text-lg font-semibold text-gradient-gold mb-4 flex items-center gap-2">
        <Gamepad2 className="w-5 h-5" />
        Mindful Games
      </h3>

      {/* Game Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {games.map((game) => (
          <motion.button
            key={game.id}
            onClick={() => setSelectedGame(game)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
              selectedGame.id === game.id 
                ? 'bg-primary/20 border-2 border-primary/40' 
                : 'bg-muted/30 border-2 border-transparent hover:bg-muted/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${game.color} text-white flex items-center justify-center mb-2`}>
              {game.icon}
            </div>
            <p className="text-sm font-medium whitespace-nowrap">{game.name}</p>
          </motion.button>
        ))}
      </div>

      {/* Game Display */}
      <motion.div 
        className="bg-muted/20 rounded-2xl p-4"
        layoutId="game-area"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGame.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {renderGame()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
