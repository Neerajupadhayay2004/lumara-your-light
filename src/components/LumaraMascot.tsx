import { motion } from 'framer-motion';

interface LumaraMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'happy' | 'calm' | 'listening' | 'thinking';
  className?: string;
}

const sizeMap = {
  sm: 80,
  md: 120,
  lg: 180,
  xl: 280,
};

export const LumaraMascot = ({ size = 'md', emotion = 'happy', className = '' }: LumaraMascotProps) => {
  const dimensions = sizeMap[size];
  
  const eyeVariants = {
    happy: { scaleY: 1, y: 0 },
    calm: { scaleY: 0.8, y: 2 },
    listening: { scaleY: 1.1, y: -2 },
    thinking: { scaleY: 0.6, y: 3 },
  };

  const bodyVariants = {
    happy: { scale: 1, rotate: 0 },
    calm: { scale: 0.98, rotate: 0 },
    listening: { scale: 1.02, rotate: -2 },
    thinking: { scale: 1, rotate: 2 },
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: dimensions, height: dimensions }}
      animate="animate"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-lumara-gold/30 blur-2xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-lumara-gold-light rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + (i % 3) * 20}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            y: [-5, -15, -5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Main body */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-lg"
        initial={false}
        animate={bodyVariants[emotion]}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <defs>
          {/* Golden gradient */}
          <radialGradient id="bodyGradient" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="50%" stopColor="#FFD23F" />
            <stop offset="100%" stopColor="#F5A623" />
          </radialGradient>
          
          {/* Shine gradient */}
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Screen gradient */}
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#16213e" />
          </linearGradient>
        </defs>

        {/* Body shape - rounded cute robot */}
        <motion.ellipse
          cx="100"
          cy="115"
          rx="65"
          ry="70"
          fill="url(#bodyGradient)"
          animate={{ 
            ry: [70, 72, 70],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Body shine */}
        <ellipse
          cx="75"
          cy="90"
          rx="25"
          ry="30"
          fill="url(#shineGradient)"
        />

        {/* Head/helmet */}
        <motion.ellipse
          cx="100"
          cy="65"
          rx="55"
          ry="50"
          fill="url(#bodyGradient)"
        />

        {/* Head shine */}
        <ellipse
          cx="80"
          cy="45"
          rx="20"
          ry="18"
          fill="url(#shineGradient)"
        />

        {/* Face screen background */}
        <ellipse
          cx="100"
          cy="70"
          rx="40"
          ry="32"
          fill="url(#screenGradient)"
        />

        {/* Eyes */}
        <motion.g
          variants={eyeVariants}
          animate={emotion}
          transition={{ duration: 0.3 }}
        >
          {/* Left eye */}
          <motion.ellipse
            cx="82"
            cy="68"
            rx="8"
            ry="10"
            fill="#FFFFFF"
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 4,
            }}
          />
          {/* Left pupil */}
          <circle cx="84" cy="70" r="3" fill="#4A90D9" />

          {/* Right eye */}
          <motion.ellipse
            cx="118"
            cy="68"
            rx="8"
            ry="10"
            fill="#FFFFFF"
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 4,
            }}
          />
          {/* Right pupil */}
          <circle cx="120" cy="70" r="3" fill="#4A90D9" />
        </motion.g>

        {/* Smile */}
        <motion.path
          d="M 85 82 Q 100 95, 115 82"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            d: emotion === 'happy' 
              ? "M 85 82 Q 100 95, 115 82"
              : emotion === 'thinking'
              ? "M 88 85 Q 100 88, 112 85"
              : "M 85 82 Q 100 92, 115 82"
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Antenna */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ originX: '100px', originY: '20px' }}
        >
          <rect x="97" y="12" width="6" height="15" rx="3" fill="#F5A623" />
          <motion.circle
            cx="100"
            cy="8"
            r="6"
            fill="#FFE066"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.g>

        {/* Arms */}
        <motion.ellipse
          cx="40"
          cy="120"
          rx="12"
          ry="25"
          fill="url(#bodyGradient)"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.ellipse
          cx="160"
          cy="120"
          rx="12"
          ry="25"
          fill="url(#bodyGradient)"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />

        {/* Cheek blush */}
        <circle cx="60" cy="75" r="8" fill="#FFB5B5" opacity="0.5" />
        <circle cx="140" cy="75" r="8" fill="#FFB5B5" opacity="0.5" />
      </motion.svg>
    </motion.div>
  );
};
