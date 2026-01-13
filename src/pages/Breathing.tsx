import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreathingExercise } from '@/components/BreathingExercise';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Breathing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Home className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-card border border-border/30 max-w-lg w-full">
          <BreathingExercise
            onComplete={() => {
              toast.success('Great job! You completed the breathing exercise 💛');
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Breathing;
