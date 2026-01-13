import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface MoodEntry {
  id: string;
  emoji: string;
  emotion: string;
  intensity: number;
  created_at: string;
}

interface MoodChartProps {
  entries: MoodEntry[];
  timeRange?: '7d' | '30d' | '90d';
}

const emotionColors: Record<string, string> = {
  happy: '#FFD23F',
  calm: '#7EC8E3',
  anxious: '#F5A623',
  sad: '#6B8DD6',
  stressed: '#E57373',
  angry: '#D32F2F',
  lonely: '#9C7BCE',
  hopeful: '#4CAF50',
  neutral: '#B8A88A',
  overwhelmed: '#BA68C8',
};

export const MoodChart = ({ entries, timeRange = '7d' }: MoodChartProps) => {
  const chartData = useMemo(() => {
    return entries
      .slice(-30)
      .map((entry) => ({
        date: format(new Date(entry.created_at), 'MMM d'),
        fullDate: format(new Date(entry.created_at), 'MMM d, yyyy'),
        intensity: entry.intensity,
        emotion: entry.emotion,
        emoji: entry.emoji,
        color: emotionColors[entry.emotion] || '#FFD23F',
      }));
  }, [entries]);

  const emotionBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((entry) => {
      counts[entry.emotion] = (counts[entry.emotion] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / entries.length) * 100),
        color: emotionColors[emotion],
      }))
      .sort((a, b) => b.count - a.count);
  }, [entries]);

  const averageIntensity = useMemo(() => {
    if (entries.length === 0) return 0;
    return Math.round(entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length * 10) / 10;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No mood entries yet. Start tracking your mood to see insights!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-card border border-border/30"
        >
          <p className="text-sm text-muted-foreground">Total Entries</p>
          <p className="text-2xl font-display font-bold text-foreground">{entries.length}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-card border border-border/30"
        >
          <p className="text-sm text-muted-foreground">Avg Intensity</p>
          <p className="text-2xl font-display font-bold text-lumara-gold">{averageIntensity}/10</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 shadow-card border border-border/30"
        >
          <p className="text-sm text-muted-foreground">Most Common</p>
          <p className="text-2xl font-display font-bold capitalize">{emotionBreakdown[0]?.emotion || '-'}</p>
        </motion.div>
      </div>

      {/* Line chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border/30"
      >
        <h4 className="font-display font-semibold mb-4">Mood Intensity Over Time</h4>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(42, 95%, 55%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(42, 95%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 10]} 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload?.[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.fullDate}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.emoji} {data.emotion} - {data.intensity}/10
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="intensity"
                stroke="hsl(42, 95%, 55%)"
                strokeWidth={3}
                fill="url(#moodGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Emotion breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border/30"
      >
        <h4 className="font-display font-semibold mb-4">Emotion Distribution</h4>
        <div className="space-y-3">
          {emotionBreakdown.slice(0, 5).map((item, index) => (
            <motion.div
              key={item.emotion}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-xl">{entries.find(e => e.emotion === item.emotion)?.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium capitalize">{item.emotion}</span>
                  <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
