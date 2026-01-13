import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CrisisAlertProps {
  isVisible: boolean;
  onClose: () => void;
}

const helplines = [
  { country: 'India', name: 'iCall', number: '9152987821', available: '24/7' },
  { country: 'India', name: 'Vandrevala Foundation', number: '1860-2662-345', available: '24/7' },
  { country: 'USA', name: 'National Suicide Prevention', number: '988', available: '24/7' },
  { country: 'UK', name: 'Samaritans', number: '116 123', available: '24/7' },
  { country: 'Global', name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
];

export const CrisisAlert = ({ isVisible, onClose }: CrisisAlertProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card w-full max-w-lg rounded-3xl shadow-float overflow-hidden"
          >
            {/* Header */}
            <div className="bg-lumara-peach/30 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-background/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-lumara-rose/50">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    You're Not Alone 💛
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    I'm here with you. Let's get you some support.
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-foreground leading-relaxed">
                I noticed you might be going through something really difficult right now. 
                It takes courage to express these feelings. Please know that professional 
                support is available and can really help.
              </p>

              <div className="bg-secondary/50 rounded-2xl p-4">
                <h4 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Crisis Helplines
                </h4>
                <div className="space-y-3">
                  {helplines.map((helpline, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <p className="font-medium">{helpline.name}</p>
                        <p className="text-xs text-muted-foreground">{helpline.country}</p>
                      </div>
                      <a 
                        href={`tel:${helpline.number.replace(/[^0-9]/g, '')}`}
                        className="text-lumara-gold font-medium hover:underline"
                      >
                        {helpline.number}
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-sm text-muted-foreground text-center">
                  Would you like to continue talking with me? I'm here to listen.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={onClose} 
                    variant="warm" 
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Continue Chatting
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/30 px-6 py-4">
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ Lumara is not a replacement for professional mental health care. 
                If you're in immediate danger, please call emergency services.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
