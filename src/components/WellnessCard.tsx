import { motion } from 'framer-motion';
import { Wind, Heart, Pen, Flower2, Activity, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WellnessCardProps {
  type: 'breathing' | 'meditation' | 'journaling' | 'grounding' | 'activity';
  title: string;
  description: string;
  completed?: boolean;
  onComplete?: () => void;
  onClick?: () => void;
}

const iconMap = {
  breathing: Wind,
  meditation: Flower2,
  journaling: Pen,
  grounding: Heart,
  activity: Activity,
};

const colorMap = {
  breathing: 'bg-lumara-sky/30 border-lumara-sky/50 hover:bg-lumara-sky/40',
  meditation: 'bg-lumara-lavender/30 border-lumara-lavender/50 hover:bg-lumara-lavender/40',
  journaling: 'bg-lumara-peach/30 border-lumara-peach/50 hover:bg-lumara-peach/40',
  grounding: 'bg-lumara-sage/30 border-lumara-sage/50 hover:bg-lumara-sage/40',
  activity: 'bg-lumara-gold/20 border-lumara-gold/40 hover:bg-lumara-gold/30',
};

const iconColorMap = {
  breathing: 'text-blue-500',
  meditation: 'text-purple-500',
  journaling: 'text-orange-500',
  grounding: 'text-green-500',
  activity: 'text-yellow-600',
};

export const WellnessCard = ({ 
  type, 
  title, 
  description, 
  completed, 
  onComplete,
  onClick 
}: WellnessCardProps) => {
  const Icon = iconMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer
        ${colorMap[type]}
        ${completed ? 'opacity-60' : ''}
      `}
      onClick={onClick}
    >
      {completed && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-background/50 ${iconColorMap[type]}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-display font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          
          {onComplete && !completed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="mt-3 text-xs"
            >
              Mark as complete
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
