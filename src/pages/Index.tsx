import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, BarChart3, Heart, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LumaraMascot } from '@/components/LumaraMascot';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { icon: MessageCircle, title: 'AI Companion', description: 'Talk to Lumara anytime—empathetic, non-judgmental support 24/7' },
    { icon: BarChart3, title: 'Mood Tracking', description: 'Log your feelings daily and discover patterns in your emotional journey' },
    { icon: Heart, title: 'Wellness Tools', description: 'Breathing exercises, guided meditation, and grounding techniques' },
    { icon: Shield, title: 'Crisis Support', description: 'Gentle guidance and helpline access when you need it most' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 rounded-full bg-lumara-gold/20 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-lumara-lavender/30 blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lumara-peach/10 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <LumaraMascot size="xl" emotion="happy" className="mx-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-5xl md:text-7xl font-bold mb-4"
          >
            <span className="text-gradient-gold">Lumara</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-2 font-display"
          >
            Your light in dark moments
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            An AI-powered mental health companion offering empathetic support,
            mood tracking, and wellness tools—available whenever you need a caring presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button onClick={() => navigate('/dashboard')} variant="hero" size="xl">
              <Sparkles className="w-5 h-5" />
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button onClick={() => navigate('/chat')} variant="outline" size="xl">
              <MessageCircle className="w-5 h-5" />
              Talk to Lumara
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            ⚠️ Lumara is NOT a replacement for professional mental health care
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-12"
          >
            How Lumara Supports You
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-3xl p-6 shadow-card border border-border/30 hover:shadow-float transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-lumara-gold/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-lumara-gold" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Made with 💛 for your mental wellness • Not a substitute for professional help
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
