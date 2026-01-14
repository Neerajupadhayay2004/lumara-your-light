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

const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'self-harm'];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const checkForCrisis = (text: string): boolean => {
    return crisisKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    if (checkForCrisis(content)) setShowCrisisAlert(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lumara-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })), userMessage: content }),
      });

      if (!response.ok || !response.body) throw new Error('Failed');

      let assistantContent = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIdx;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIdx).trim();
          buffer = buffer.slice(newlineIdx + 1);
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                return [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: assistantContent, timestamp: new Date() }];
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm here for you. Let's try again in a moment 💛", timestamp: new Date() }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="shrink-0 bg-card/80 backdrop-blur-lg border-b border-border/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LumaraMascot size="sm" emotion={isLoading ? 'thinking' : 'calm'} />
            <div><h1 className="font-display font-bold text-gradient-gold">Lumara</h1><p className="text-xs text-muted-foreground">Your companion is listening</p></div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}><Home className="w-5 h-5" /></Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}><LayoutDashboard className="w-4 h-4 mr-1" />Dashboard</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden p-4"><div className="max-w-4xl mx-auto h-full"><ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} /></div></main>
      <CrisisAlert isVisible={showCrisisAlert} onClose={() => setShowCrisisAlert(false)} />
    </div>
  );
};

export default Chat;
