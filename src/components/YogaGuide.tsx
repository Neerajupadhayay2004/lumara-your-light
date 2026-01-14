import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Timer, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YogaPose {
  id: string;
  name: string;
  sanskrit: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  instructions: string[];
  image: string;
}

const yogaPoses: YogaPose[] = [
  {
    id: 'child',
    name: "Child's Pose",
    sanskrit: 'Balasana',
    duration: 60,
    difficulty: 'beginner',
    benefits: ['Calms the mind', 'Relieves stress', 'Stretches lower back'],
    instructions: [
      'Kneel on the floor with toes together',
      'Sit back on your heels',
      'Fold forward, extending arms in front',
      'Rest your forehead on the ground',
      'Breathe deeply and relax'
    ],
    image: '🧘'
  },
  {
    id: 'mountain',
    name: 'Mountain Pose',
    sanskrit: 'Tadasana',
    duration: 30,
    difficulty: 'beginner',
    benefits: ['Improves posture', 'Increases awareness', 'Strengthens legs'],
    instructions: [
      'Stand with feet hip-width apart',
      'Ground through all four corners of feet',
      'Engage your thighs slightly',
      'Lengthen your spine, crown reaching up',
      'Arms relaxed at sides, palms facing forward'
    ],
    image: '🏔️'
  },
  {
    id: 'tree',
    name: 'Tree Pose',
    sanskrit: 'Vrksasana',
    duration: 45,
    difficulty: 'beginner',
    benefits: ['Improves balance', 'Builds focus', 'Strengthens ankles'],
    instructions: [
      'Start in Mountain Pose',
      'Shift weight to left foot',
      'Place right foot on inner left thigh or calf (not knee)',
      'Bring hands to heart or extend overhead',
      'Find a focal point and breathe'
    ],
    image: '🌳'
  },
  {
    id: 'warrior1',
    name: 'Warrior I',
    sanskrit: 'Virabhadrasana I',
    duration: 45,
    difficulty: 'beginner',
    benefits: ['Opens chest and lungs', 'Strengthens shoulders', 'Builds stamina'],
    instructions: [
      'Step right foot forward into a lunge',
      'Turn left foot out 45 degrees',
      'Bend right knee over ankle',
      'Raise arms overhead, palms facing',
      'Look up, opening your heart'
    ],
    image: '⚔️'
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    sanskrit: 'Marjaryasana-Bitilasana',
    duration: 60,
    difficulty: 'beginner',
    benefits: ['Warms the spine', 'Releases tension', 'Syncs breath with movement'],
    instructions: [
      'Start on hands and knees',
      'Inhale: Drop belly, lift chest (Cow)',
      'Exhale: Round spine, tuck chin (Cat)',
      'Flow between these positions',
      'Let your breath guide the movement'
    ],
    image: '🐱'
  },
  {
    id: 'corpse',
    name: 'Corpse Pose',
    sanskrit: 'Savasana',
    duration: 120,
    difficulty: 'beginner',
    benefits: ['Deep relaxation', 'Reduces stress', 'Integrates practice'],
    instructions: [
      'Lie flat on your back',
      'Let feet fall open, arms by sides',
      'Palms facing up, eyes closed',
      'Relax every muscle in your body',
      'Simply breathe and be still'
    ],
    image: '😌'
  }
];

interface YogaRoutine {
  id: string;
  name: string;
  description: string;
  duration: number;
  poses: string[];
  color: string;
}

const routines: YogaRoutine[] = [
  {
    id: 'morning',
    name: 'Morning Energizer',
    description: 'Wake up your body gently',
    duration: 10,
    poses: ['mountain', 'cat-cow', 'warrior1', 'tree'],
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'stress-relief',
    name: 'Stress Relief',
    description: 'Release tension and anxiety',
    duration: 15,
    poses: ['child', 'cat-cow', 'warrior1', 'tree', 'corpse'],
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'bedtime',
    name: 'Bedtime Relaxation',
    description: 'Prepare for restful sleep',
    duration: 10,
    poses: ['child', 'cat-cow', 'corpse'],
    color: 'from-purple-400 to-violet-500'
  }
];

export const YogaGuide = () => {
  const [selectedRoutine, setSelectedRoutine] = useState<YogaRoutine>(routines[0]);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const currentPose = yogaPoses.find(p => p.id === selectedRoutine.poses[currentPoseIndex]) || yogaPoses[0];

  const startRoutine = () => {
    setCurrentPoseIndex(0);
    setIsActive(true);
    const pose = yogaPoses.find(p => p.id === selectedRoutine.poses[0]);
    if (pose) {
      setTimeRemaining(pose.duration);
      // Speak the pose name
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`${pose.name}. ${pose.instructions[0]}`);
        utterance.rate = 0.85;
        speechSynthesis.speak(utterance);
      }
    }
  };

  const nextPose = () => {
    if (currentPoseIndex < selectedRoutine.poses.length - 1) {
      const nextIndex = currentPoseIndex + 1;
      setCurrentPoseIndex(nextIndex);
      const pose = yogaPoses.find(p => p.id === selectedRoutine.poses[nextIndex]);
      if (pose) {
        setTimeRemaining(pose.duration);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`${pose.name}. ${pose.instructions[0]}`);
          utterance.rate = 0.85;
          speechSynthesis.speak(utterance);
        }
      }
    } else {
      setIsActive(false);
      setCurrentPoseIndex(0);
    }
  };

  const prevPose = () => {
    if (currentPoseIndex > 0) {
      setCurrentPoseIndex(currentPoseIndex - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500 bg-green-500/10';
      case 'intermediate': return 'text-amber-500 bg-amber-500/10';
      case 'advanced': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30"
    >
      <h3 className="font-display text-lg font-semibold text-gradient-gold mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5" />
        Yoga Practice
      </h3>

      {/* Routine Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {routines.map((routine) => (
          <motion.button
            key={routine.id}
            onClick={() => {
              setSelectedRoutine(routine);
              setCurrentPoseIndex(0);
              setIsActive(false);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
              selectedRoutine.id === routine.id 
                ? 'bg-primary/20 border-2 border-primary/40' 
                : 'bg-muted/30 border-2 border-transparent hover:bg-muted/50'
            }`}
          >
            <p className="text-sm font-medium whitespace-nowrap">{routine.name}</p>
            <p className="text-xs text-muted-foreground">{routine.duration} min</p>
          </motion.button>
        ))}
      </div>

      {/* Current Pose Display */}
      <motion.div 
        className={`bg-gradient-to-br ${selectedRoutine.color} rounded-2xl p-6 mb-4 text-white relative overflow-hidden`}
        layoutId="yoga-display"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-4xl">{currentPose.image}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentPose.difficulty)} bg-white/10`}>
              {currentPose.difficulty}
            </span>
          </div>
          
          <h4 className="text-xl font-bold">{currentPose.name}</h4>
          <p className="text-sm opacity-80 italic mb-4">{currentPose.sanskrit}</p>

          <div className="flex items-center gap-2 text-sm opacity-80 mb-4">
            <Timer className="w-4 h-4" />
            <span>{currentPose.duration}s hold</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPose.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm font-medium mb-2">Instructions:</p>
              <ol className="text-sm space-y-1 opacity-90">
                {currentPose.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-white/60">{idx + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          {selectedRoutine.poses.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentPoseIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Benefits */}
      <div className="mb-4">
        <p className="text-sm font-medium text-muted-foreground mb-2">Benefits:</p>
        <div className="flex flex-wrap gap-2">
          {currentPose.benefits.map((benefit, idx) => (
            <span key={idx} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevPose}
          disabled={currentPoseIndex === 0}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        {!isActive ? (
          <Button 
            onClick={startRoutine}
            className="px-6 bg-gradient-to-br from-primary to-primary-glow hover:scale-105 transition-transform"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Routine
          </Button>
        ) : (
          <Button 
            onClick={nextPose}
            className="px-6 bg-gradient-to-br from-primary to-primary-glow hover:scale-105 transition-transform"
          >
            {currentPoseIndex < selectedRoutine.poses.length - 1 ? 'Next Pose' : 'Complete'}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextPose}
          disabled={currentPoseIndex === selectedRoutine.poses.length - 1 && !isActive}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};
