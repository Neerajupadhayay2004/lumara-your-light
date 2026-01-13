import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp, Wind, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MoodSelector } from '@/components/MoodSelector';
import { MoodChart } from '@/components/MoodChart';
import { WellnessCard } from '@/components/WellnessCard';
import { LumaraMascot } from '@/components/LumaraMascot';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Demo data for visualization
const demoMoodEntries = [
  { id: '1', emoji: '😊', emotion: 'happy', intensity: 7, created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', emoji: '😰', emotion: 'anxious', intensity: 5, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', emoji: '😌', emotion: 'calm', intensity: 6, created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', emoji: '😢', emotion: 'sad', intensity: 4, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', emoji: '🌟', emotion: 'hopeful', intensity: 8, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '6', emoji: '😊', emotion: 'happy', intensity: 7, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

const wellnessRecommendations = [
  { type: 'breathing' as const, title: '4-4-6 Breathing', description: 'A calming breath technique to reduce anxiety and center yourself.' },
  { type: 'journaling' as const, title: 'Gratitude Prompt', description: 'Write 3 things you\'re grateful for today, no matter how small.' },
  { type: 'grounding' as const, title: '5-4-3-2-1 Grounding', description: 'Notice 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.' },
  { type: 'meditation' as const, title: 'Body Scan', description: 'Take 5 minutes to slowly scan from head to toe, releasing tension.' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [moodEntries, setMoodEntries] = useState(demoMoodEntries);
  const [activeTab, setActiveTab] = useState<'mood' | 'insights' | 'wellness'>('mood');

  const handleMoodSubmit = (data: { emoji: string; emotion: string; intensity: number; journalNote?: string }) => {
    const newEntry = {
      id: Date.now().toString(),
      emoji: data.emoji,
      emotion: data.emotion,
      intensity: data.intensity,
      created_at: new Date().toISOString(),
    };
    setMoodEntries([...moodEntries, newEntry]);
    toast.success('Mood logged! Take care of yourself today 💛');
  };

  const tabs = [
    { id: 'mood', label: 'Log Mood', icon: '✨' },
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'wellness', label: 'Wellness', icon: '🌿' },
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LumaraMascot size="sm" emotion="calm" />
            <span className="font-display font-bold text-lg text-gradient-gold">Lumara</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="glow" size="sm" onClick={() => navigate('/chat')}>
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[65px] z-30 bg-background/80 backdrop-blur-lg border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-lumara-gold text-primary-foreground shadow-glow'
                    : 'bg-card hover:bg-secondary'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'mood' && (
            <div className="bg-card rounded-3xl p-6 shadow-card border border-border/30">
              <MoodSelector onSubmit={handleMoodSubmit} />
            </div>
          )}

          {activeTab === 'insights' && (
            <MoodChart entries={moodEntries} />
          )}

          {activeTab === 'wellness' && (
            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold mb-4">
                Personalized Wellness Activities
              </h3>
              {wellnessRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <WellnessCard
                    type={rec.type}
                    title={rec.title}
                    description={rec.description}
                    onClick={() => {
                      if (rec.type === 'breathing') {
                        navigate('/breathing');
                      } else {
                        toast.info('Activity started! Take your time 💛');
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
