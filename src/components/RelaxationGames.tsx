import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, RotateCcw, Trophy, Palette, Grid3X3, Sparkles, Heart, Target, Zap, Brain, Flower2, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

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
  { id: 'breathing-game', name: 'Bubble Pop', description: 'Pop bubbles mindfully', icon: <Sparkles className="w-5 h-5" />, color: 'from-cyan-400 to-teal-500' },
  { id: 'gratitude-garden', name: 'Gratitude Garden', description: 'Grow your gratitude', icon: <Flower2 className="w-5 h-5" />, color: 'from-green-400 to-emerald-500' },
  { id: 'focus-flow', name: 'Focus Flow', description: 'Follow the pattern', icon: <Target className="w-5 h-5" />, color: 'from-amber-400 to-orange-500' },
  { id: 'zen-puzzle', name: 'Zen Puzzle', description: 'Arrange peaceful tiles', icon: <Mountain className="w-5 h-5" />, color: 'from-violet-400 to-purple-500' },
  { id: 'emotion-match', name: 'Emotion Match', description: 'Connect emotions', icon: <Heart className="w-5 h-5" />, color: 'from-rose-400 to-pink-500' },
  { id: 'reaction-calm', name: 'Calm Reflex', description: 'Test your calm reflexes', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-400 to-amber-500' },
  { id: 'word-calm', name: 'Calm Words', description: 'Find peaceful words', icon: <Brain className="w-5 h-5" />, color: 'from-teal-400 to-cyan-500' },
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
    let moveInterval: NodeJS.Timeout;
    
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

      moveInterval = setInterval(() => {
        setBubbles(prev => prev.map(b => ({ ...b, y: b.y - 5 })));
      }, 100);

      return () => {
        clearInterval(interval);
        clearInterval(moveInterval);
      };
    }

    return () => {
      clearInterval(interval);
    };
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

// Gratitude Garden Game
const GratitudeGardenGame = () => {
  const [flowers, setFlowers] = useState<{ id: number; x: number; emoji: string; size: number }[]>([]);
  const [gratitude, setGratitude] = useState('');
  const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼', '🪻', '🌵', '🌲'];

  const plantFlower = () => {
    if (!gratitude.trim()) return;
    
    const newFlower = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
      size: Math.random() * 20 + 30,
    };
    setFlowers(prev => [...prev, newFlower]);
    setGratitude('');
  };

  return (
    <div>
      <div className="relative h-40 bg-gradient-to-b from-sky-100/50 to-green-100/50 dark:from-sky-900/30 dark:to-green-900/30 rounded-xl overflow-hidden mb-4">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-700/30 to-green-600/30" />
        
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute bottom-6"
              style={{ left: `${flower.x}%`, fontSize: flower.size }}
            >
              {flower.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {flowers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Type something you're grateful for</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && plantFlower()}
          placeholder="I'm grateful for..."
          className="flex-1 px-4 py-2 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
        />
        <Button onClick={plantFlower} disabled={!gratitude.trim()}>
          🌱 Plant
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-2">
        {flowers.length} flowers in your garden
      </p>
    </div>
  );
};

// Focus Flow Game - Simon Says style
const FocusFlowGame = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const colors = ['bg-rose-400', 'bg-blue-400', 'bg-green-400', 'bg-amber-400'];

  const startGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
  };

  const showSequence = useCallback(async () => {
    setIsShowingSequence(true);
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveButton(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(null);
    }
    setIsShowingSequence(false);
  }, [sequence]);

  useEffect(() => {
    if (sequence.length > 0 && !gameOver) {
      showSequence();
    }
  }, [sequence, gameOver, showSequence]);

  const handleButtonClick = (index: number) => {
    if (isShowingSequence || gameOver) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 200);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(s => s + 1);
      setPlayerSequence([]);
      setTimeout(() => {
        setSequence([...sequence, Math.floor(Math.random() * 4)]);
      }, 1000);
    }
  };

  return (
    <div className="text-center">
      <div className="grid grid-cols-2 gap-3 mb-4 max-w-[200px] mx-auto">
        {colors.map((color, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleButtonClick(idx)}
            disabled={isShowingSequence}
            animate={{ scale: activeButton === idx ? 1.1 : 1, opacity: activeButton === idx ? 1 : 0.7 }}
            className={`aspect-square rounded-2xl ${color} transition-all ${
              isShowingSequence ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-100'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="font-bold">{score}</span>
        </div>
      </div>

      {gameOver ? (
        <div className="space-y-2">
          <p className="text-rose-500 font-medium">Game Over!</p>
          <Button onClick={startGame}>Play Again</Button>
        </div>
      ) : sequence.length === 0 ? (
        <Button onClick={startGame}>Start</Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          {isShowingSequence ? 'Watch the pattern...' : 'Your turn!'}
        </p>
      )}
    </div>
  );
};

// Zen Puzzle - Sliding puzzle
const ZenPuzzleGame = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = useCallback(() => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    // Shuffle
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setTiles(nums);
    setMoves(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const canMove = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 3);
    const emptyRow = Math.floor(emptyIndex / 3);
    const col = index % 3;
    const emptyCol = emptyIndex % 3;
    
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };

  const moveTile = (index: number) => {
    if (!canMove(index)) return;
    
    const newTiles = [...tiles];
    const emptyIndex = tiles.indexOf(0);
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    setTiles(newTiles);
    setMoves(m => m + 1);
  };

  const isSolved = tiles.every((tile, idx) => tile === (idx + 1) % 9);

  return (
    <div className="text-center">
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mb-4">
        {tiles.map((tile, idx) => (
          <motion.button
            key={idx}
            onClick={() => moveTile(idx)}
            whileHover={canMove(idx) ? { scale: 1.05 } : {}}
            whileTap={canMove(idx) ? { scale: 0.95 } : {}}
            className={`aspect-square rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
              tile === 0 
                ? 'bg-transparent' 
                : canMove(idx)
                ? 'bg-primary/20 hover:bg-primary/30 cursor-pointer'
                : 'bg-muted/50'
            }`}
          >
            {tile !== 0 && tile}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Moves: {moves}</span>
        {isSolved && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-primary font-bold"
          >
            🎉 Solved!
          </motion.span>
        )}
        <Button variant="ghost" size="sm" onClick={initGame}>
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
      </div>
    </div>
  );
};

// Emotion Match Game
const EmotionMatchGame = () => {
  const emotionPairs = [
    { emoji: '😊', word: 'Happy' },
    { emoji: '😌', word: 'Calm' },
    { emoji: '💪', word: 'Strong' },
    { emoji: '🌟', word: 'Hopeful' },
  ];
  
  const [emojis, setEmojis] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    setEmojis(emotionPairs.map(e => e.emoji).sort(() => Math.random() - 0.5));
    setWords(emotionPairs.map(e => e.word).sort(() => Math.random() - 0.5));
    setMatched([]);
  }, []);

  const handleWordClick = (word: string) => {
    if (!selectedEmoji || matched.includes(selectedEmoji)) return;
    
    const pair = emotionPairs.find(e => e.emoji === selectedEmoji);
    if (pair && pair.word === word) {
      setMatched([...matched, selectedEmoji]);
      setSelectedEmoji(null);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  };

  const reset = () => {
    setEmojis(emotionPairs.map(e => e.emoji).sort(() => Math.random() - 0.5));
    setWords(emotionPairs.map(e => e.word).sort(() => Math.random() - 0.5));
    setMatched([]);
    setSelectedEmoji(null);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          {emojis.map((emoji) => (
            <motion.button
              key={emoji}
              onClick={() => !matched.includes(emoji) && setSelectedEmoji(emoji)}
              animate={{ scale: selectedEmoji === emoji ? 1.1 : 1 }}
              className={`w-full py-3 rounded-xl text-2xl transition-all ${
                matched.includes(emoji)
                  ? 'bg-green-500/20 opacity-50'
                  : selectedEmoji === emoji
                  ? 'bg-primary/30 ring-2 ring-primary'
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {words.map((word) => (
            <motion.button
              key={word}
              onClick={() => handleWordClick(word)}
              animate={{ x: wrong && selectedEmoji ? [0, -5, 5, 0] : 0 }}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                matched.some(e => emotionPairs.find(p => p.emoji === e)?.word === word)
                  ? 'bg-green-500/20 opacity-50'
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>
      
      {matched.length === emotionPairs.length && (
        <div className="text-center space-y-2">
          <p className="text-primary font-bold">🎉 All matched!</p>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

// Calm Reflex Game
const CalmReflexGame = () => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [tooEarly, setTooEarly] = useState(false);

  const start = () => {
    setIsWaiting(true);
    setIsReady(false);
    setTooEarly(false);
    setReactionTime(null);
    
    const delay = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setIsReady(true);
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (!isWaiting) {
      start();
      return;
    }
    
    if (!isReady) {
      setTooEarly(true);
      setIsWaiting(false);
      return;
    }
    
    const time = Date.now() - startTime;
    setReactionTime(time);
    setIsWaiting(false);
    setIsReady(false);
    
    if (!bestTime || time < bestTime) {
      setBestTime(time);
    }
  };

  return (
    <div className="text-center">
      <motion.button
        onClick={handleClick}
        animate={{ scale: isReady ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 0.3, repeat: isReady ? Infinity : 0 }}
        className={`w-full h-40 rounded-2xl flex items-center justify-center text-white font-bold text-lg transition-all ${
          tooEarly
            ? 'bg-rose-500'
            : isReady
            ? 'bg-green-500 cursor-pointer'
            : isWaiting
            ? 'bg-amber-500'
            : 'bg-primary cursor-pointer'
        }`}
      >
        {tooEarly
          ? 'Too early! Click to try again'
          : isReady
          ? 'Click now!'
          : isWaiting
          ? 'Wait for green...'
          : 'Click to start'}
      </motion.button>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        {reactionTime && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Your time</p>
            <p className="text-2xl font-bold text-primary">{reactionTime}ms</p>
          </div>
        )}
        {bestTime && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Best time</p>
            <p className="text-2xl font-bold text-amber-500">{bestTime}ms</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Calm Words Game - Word search
const CalmWordsGame = () => {
  const calmWords = ['peace', 'calm', 'relax', 'love', 'joy', 'hope', 'zen', 'rest'];
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const newWord = useCallback(() => {
    const word = calmWords[Math.floor(Math.random() * calmWords.length)];
    setCurrentWord(word);
    setScrambled(word.split('').sort(() => Math.random() - 0.5).join(''));
    setInput('');
    setFeedback(null);
  }, []);

  useEffect(() => {
    newWord();
  }, [newWord]);

  const checkAnswer = () => {
    if (input.toLowerCase() === currentWord) {
      setScore(s => s + 1);
      setFeedback('correct');
      setTimeout(newWord, 500);
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-2">Unscramble this peaceful word:</p>
      
      <motion.div 
        className="text-3xl font-bold tracking-widest mb-4 text-primary"
        animate={{ scale: feedback === 'correct' ? [1, 1.2, 1] : 1 }}
      >
        {scrambled.toUpperCase()}
      </motion.div>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          placeholder="Type your answer..."
          className={`flex-1 px-4 py-2 rounded-xl bg-muted/50 border transition-all ${
            feedback === 'wrong' ? 'border-rose-500' : 'border-border/50'
          } focus:outline-none focus:border-primary`}
        />
        <Button onClick={checkAnswer}>Check</Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="font-bold">{score}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={newWord}>
          Skip
        </Button>
      </div>
    </div>
  );
};

export const RelaxationGames = () => {
  const [selectedGame, setSelectedGame] = useState<Game>(games[0]);
  const { t } = useLanguage();

  const renderGame = () => {
    switch (selectedGame.id) {
      case 'color-match':
        return <ColorMatchGame />;
      case 'memory':
        return <MemoryGame />;
      case 'breathing-game':
        return <BubblePopGame />;
      case 'gratitude-garden':
        return <GratitudeGardenGame />;
      case 'focus-flow':
        return <FocusFlowGame />;
      case 'zen-puzzle':
        return <ZenPuzzleGame />;
      case 'emotion-match':
        return <EmotionMatchGame />;
      case 'reaction-calm':
        return <CalmReflexGame />;
      case 'word-calm':
        return <CalmWordsGame />;
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
        {t('games')}
      </h3>

      {/* Game Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
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
