import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, MessageCircle, Heart, Music, Sparkles, Flame, Gamepad2, Wind, 
  BarChart3, Mic, Moon, Sun, Menu, X, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LumaraMascot } from '@/components/LumaraMascot';
import { MoodSelector } from '@/components/MoodSelector';
import { MoodChart } from '@/components/MoodChart';
import { MusicPlayer } from '@/components/MusicPlayer';
import { MeditationGuide } from '@/components/MeditationGuide';
import { YogaGuide } from '@/components/YogaGuide';
import { RelaxationGames } from '@/components/RelaxationGames';
import { VoiceAgent } from '@/components/VoiceAgent';
import { BreathingExercise } from '@/components/BreathingExercise';
import { toast } from 'sonner';

type TabType = 'overview' | 'mood' | 'insights' | 'music' | 'meditation' | 'yoga' | 'games' | 'breathing' | 'voice';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" />, color: 'from-amber-400 to-orange-500' },
  { id: 'mood', label: 'Log Mood', icon: <Heart className="w-5 h-5" />, color: 'from-rose-400 to-pink-500' },
  { id: 'insights', label: 'Insights', icon: <BarChart3 className="w-5 h-5" />, color: 'from-blue-400 to-indigo-500' },
  { id: 'music', label: 'Sounds', icon: <Music className="w-5 h-5" />, color: 'from-green-400 to-emerald-500' },
  { id: 'meditation', label: 'Meditate', icon: <Sparkles className="w-5 h-5" />, color: 'from-purple-400 to-violet-500' },
  { id: 'yoga', label: 'Yoga', icon: <Flame className="w-5 h-5" />, color: 'from-orange-400 to-red-500' },
  { id: 'games', label: 'Games', icon: <Gamepad2 className="w-5 h-5" />, color: 'from-cyan-400 to-teal-500' },
  { id: 'breathing', label: 'Breathe', icon: <Wind className="w-5 h-5" />, color: 'from-sky-400 to-blue-500' },
  { id: 'voice', label: 'Voice', icon: <Mic className="w-5 h-5" />, color: 'from-pink-400 to-rose-500' },
];

const demoMoodEntries = [
  { id: '1', emoji: '😊', emotion: 'happy', intensity: 7, created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', emoji: '😰', emotion: 'anxious', intensity: 5, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', emoji: '😌', emotion: 'calm', intensity: 6, created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', emoji: '😢', emotion: 'sad', intensity: 4, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', emoji: '🌟', emotion: 'hopeful', intensity: 8, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '6', emoji: '😊', emotion: 'happy', intensity: 7, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

const QuickActionCard = ({ item, onClick }: { item: NavItem; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="bg-card/60 backdrop-blur-xl rounded-2xl p-4 border border-border/30 text-left hover:border-primary/30 transition-all group"
  >
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
      {item.icon}
    </div>
    <h3 className="font-medium text-foreground">{item.label}</h3>
    <p className="text-xs text-muted-foreground mt-1">Tap to explore</p>
  </motion.button>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moodEntries, setMoodEntries] = useState(demoMoodEntries);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary/20 via-primary-glow/10 to-transparent rounded-3xl p-6 md:p-8 border border-primary/20"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <LumaraMascot size="lg" emotion="happy" />
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold mb-2">
                    Welcome to Your Sanctuary 💛
                  </h2>
                  <p className="text-muted-foreground max-w-xl">
                    This is your safe space to explore, heal, and grow. Every tool here is designed 
                    with love to support your mental wellbeing.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <Button onClick={() => navigate('/chat')} className="bg-gradient-to-r from-primary to-primary-glow">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Talk to Lumara
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('mood')}>
                      <Heart className="w-4 h-4 mr-2" />
                      Log Your Mood
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div>
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Wellness Activities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {navItems.filter(item => item.id !== 'overview').map((item) => (
                  <QuickActionCard key={item.id} item={item} onClick={() => setActiveTab(item.id)} />
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30 text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">✨ Daily Affirmation</p>
              <p className="text-lg md:text-xl font-display text-foreground">
                "You are worthy of love, peace, and all the good things life has to offer."
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Mood Entries', value: moodEntries.length.toString(), color: 'text-rose-500' },
                { label: 'Chat Sessions', value: '8', color: 'text-blue-500' },
                { label: 'Minutes Relaxed', value: '45', color: 'text-green-500' },
                { label: 'Days Active', value: '7', color: 'text-amber-500' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-card/60 backdrop-blur-xl rounded-2xl p-4 border border-border/30 text-center"
                >
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'mood':
        return (
          <div className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/30">
            <MoodSelector onSubmit={handleMoodSubmit} />
          </div>
        );
      case 'insights':
        return <MoodChart entries={moodEntries} />;
      case 'music':
        return <MusicPlayer />;
      case 'meditation':
        return <MeditationGuide />;
      case 'yoga':
        return <YogaGuide />;
      case 'games':
        return <RelaxationGames />;
      case 'breathing':
        return <BreathingExercise />;
      case 'voice':
        return <VoiceAgent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card/95 backdrop-blur-xl border-r border-border/30 flex flex-col"
            >
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LumaraMascot size="sm" emotion="calm" />
                  <div>
                    <h1 className="font-display font-bold text-gradient-gold">Lumara</h1>
                    <p className="text-xs text-muted-foreground">Your light in dark moments</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === item.id ? `bg-gradient-to-br ${item.color} text-white` : ''}`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </motion.button>
                  ))}
                </div>
              </nav>

              <div className="p-4 border-t border-border/30 space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/chat')}>
                  <MessageCircle className="w-4 h-4 mr-2" />Chat with Lumara
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/')}>
                  <Home className="w-4 h-4 mr-2" />Back to Home
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border/30 px-4 py-3">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <LumaraMascot size="sm" emotion="calm" />
                <h2 className="font-display font-semibold text-lg hidden sm:block">
                  {navItems.find(item => item.id === activeTab)?.label}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/chat')} className="bg-gradient-to-r from-primary to-primary-glow">
                <MessageCircle className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Chat</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="border-t border-border/30 px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            💛 Lumara is here to support you, not replace professional help. 
            <button onClick={() => toast.info('Crisis helplines available in chat')} className="text-primary hover:underline ml-1">Crisis Resources</button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
