import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';
import { CrisisAlert } from '@/components/CrisisAlert';
import { LumaraMascot } from '@/components/LumaraMascot';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Crisis keywords to detect
const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live', 'self-harm'];

// Empathetic responses for demo
const demoResponses = [
  "I hear you, and I want you to know that your feelings are completely valid. It takes courage to express what you're going through. Would you like to tell me more about what's been on your mind?",
  "Thank you for sharing that with me. It sounds like you're carrying a lot right now. Remember, you don't have to face this alone. What would feel most helpful for you right now?",
  "I can sense this has been really difficult for you. Your feelings matter, and I'm here to listen without judgment. Sometimes just putting our thoughts into words can help us understand them better.",
  "That sounds really challenging. It's okay to feel overwhelmed sometimes—it doesn't mean you're weak, it means you're human. What's one small thing that has brought you comfort in the past?",
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const checkForCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Check for crisis keywords
    if (checkForCrisis(content)) {
      setShowCrisisAlert(true);
    }

    // Simulate AI response (in production, this would call the edge function)
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * demoResponses.length);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: demoResponses[responseIndex],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 bg-card/80 backdrop-blur-lg border-b border-border/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LumaraMascot size="sm" emotion={isLoading ? 'thinking' : 'calm'} />
            <div>
              <h1 className="font-display font-bold text-gradient-gold">Lumara</h1>
              <p className="text-xs text-muted-foreground">Your companion is listening</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-hidden p-4">
        <div className="max-w-4xl mx-auto h-full">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Crisis Alert Modal */}
      <CrisisAlert
        isVisible={showCrisisAlert}
        onClose={() => setShowCrisisAlert(false)}
      />
    </div>
  );
};

export default Chat;
