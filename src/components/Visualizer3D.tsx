import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Visualizer3DProps {
  isPlaying?: boolean;
  intensity?: number;
  type?: 'waves' | 'orbs' | 'particles' | 'aurora';
}

export const Visualizer3D = ({ 
  isPlaying = false, 
  intensity = 50,
  type = 'orbs' 
}: Visualizer3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    z: number;
    size: number;
    color: string;
    speed: number;
  }>>([]);

  const colors = [
    'hsl(42, 95%, 55%)',   // Gold
    'hsl(25, 90%, 65%)',   // Peach
    'hsl(200, 70%, 60%)',  // Sky
    'hsl(270, 50%, 70%)',  // Lavender
    'hsl(150, 60%, 55%)',  // Sage
  ];

  useEffect(() => {
    const particleCount = Math.floor(intensity / 5) + 10;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      size: Math.random() * 30 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, [intensity]);

  if (type === 'waves') {
    return (
      <div className="relative w-full h-64 overflow-hidden rounded-2xl bg-gradient-to-b from-primary/10 to-transparent">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${colors[i % colors.length]}20 100%)`,
              borderRadius: '50% 50% 0 0',
            }}
            animate={isPlaying ? {
              y: [0, -20, 0],
              scaleX: [1, 1.02, 1],
            } : {}}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'aurora') {
    return (
      <div className="relative w-full h-64 overflow-hidden rounded-2xl bg-gradient-to-b from-background to-muted/50">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at ${30 + i * 15}% ${50 + (i % 2) * 30}%, ${colors[i % colors.length]}30 0%, transparent 50%)`,
              filter: 'blur(40px)',
            }}
            animate={isPlaying ? {
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
              x: [-20, 20, -20],
            } : {
              opacity: 0.5,
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
        
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={isPlaying ? {
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            } : {}}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'particles') {
    return (
      <div 
        ref={containerRef}
        className="relative w-full h-64 overflow-hidden rounded-2xl bg-gradient-to-b from-muted/20 to-muted/40"
        style={{ perspective: '1000px' }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              filter: `blur(${particle.z / 20}px)`,
            }}
            animate={isPlaying ? {
              y: [0, -30, 0],
              x: [-10, 10, -10],
              opacity: [0.4, 0.8, 0.4],
            } : {
              opacity: 0.3,
            }}
            transition={{
              duration: particle.speed * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.id * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  // Default: orbs
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-background via-muted/20 to-background"
      style={{ perspective: '1000px' }}
    >
      {/* Central orb */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, hsl(42, 95%, 75%), hsl(42, 95%, 45%), hsl(25, 90%, 35%))`,
          boxShadow: isPlaying ? '0 0 60px hsl(42, 95%, 55%), 0 0 120px hsl(42, 95%, 55% / 0.5)' : '0 0 30px hsl(42, 95%, 55% / 0.3)',
        }}
        animate={isPlaying ? {
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        } : {
          scale: 1,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Orbiting elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            width: 120 + i * 40,
            height: 120 + i * 40,
            marginLeft: -(60 + i * 20),
            marginTop: -(60 + i * 20),
          }}
          animate={isPlaying ? {
            rotate: [0, 360],
          } : {}}
          transition={{
            duration: 10 + i * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 8 + i * 2,
              height: 8 + i * 2,
              background: colors[i % colors.length],
              boxShadow: `0 0 20px ${colors[i % colors.length]}`,
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            animate={isPlaying ? {
              scale: [0.8, 1.2, 0.8],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        </motion.div>
      ))}

      {/* Floating particles */}
      {particles.slice(0, 15).map((particle) => (
        <motion.div
          key={`float-${particle.id}`}
          className="absolute rounded-full opacity-50"
          style={{
            width: particle.size / 3,
            height: particle.size / 3,
            background: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: 'blur(2px)',
          }}
          animate={isPlaying ? {
            y: [0, -50, 0],
            opacity: [0.2, 0.6, 0.2],
          } : {}}
          transition={{
            duration: particle.speed * 3,
            repeat: Infinity,
            delay: particle.id * 0.2,
          }}
        />
      ))}
    </div>
  );
};
