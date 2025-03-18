
import { CSSProperties } from 'react';

// Base animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slideUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const slideDown = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const slideRight = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const slideLeft = {
  hidden: { opacity: 0, x: 10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Enhanced stagger with customizable delay and stagger amount
export const staggerWithConfig = (staggerAmount = 0.1, initialDelay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: initialDelay,
      staggerChildren: staggerAmount
    }
  }
});

// Utility function to add staggered animations to children
export const staggerChildren = (delayIncrement = 0.1) => {
  return (index: number): CSSProperties => ({
    animationDelay: `${index * delayIncrement}s`,
    opacity: 0,
    animation: 'slide-up 0.6s ease-out forwards',
  });
};

// Page transition settings
export const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: 15,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Card hover animations
export const cardHover = {
  rest: { 
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  hover: { 
    scale: 1.03,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Button hover animations
export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeOut"
    }
  }
};

// Floating animation
export const float = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

// Pulse animation
export const pulse = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

// Rotate animation
export const rotate = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Draw SVG paths
export const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: "easeInOut" },
      opacity: { duration: 0.3 }
    }
  }
};

// Reveal text character by character
export const textReveal = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

// NEW ANIMATIONS - Self-healing system animations

// Self-healing pulse animation for AI systems
export const selfHealingPulse = {
  initial: { boxShadow: "0 0 0 0 rgba(74, 222, 128, 0)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(74, 222, 128, 0)",
      "0 0 0 10px rgba(74, 222, 128, 0.4)",
      "0 0 0 20px rgba(74, 222, 128, 0)",
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

// Error detection animation for AI systems
export const errorDetection = {
  initial: { boxShadow: "0 0 0 0 rgba(239, 68, 68, 0)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(239, 68, 68, 0)",
      "0 0 0 10px rgba(239, 68, 68, 0.4)",
      "0 0 0 20px rgba(239, 68, 68, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: 3,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

// Self-correction animation
export const selfCorrection = {
  initial: { scale: 1, borderColor: "rgba(239, 68, 68, 1)" },
  animate: {
    scale: [1, 0.95, 1.05, 1],
    borderColor: ["rgba(239, 68, 68, 1)", "rgba(239, 68, 68, 0.7)", "rgba(74, 222, 128, 0.7)", "rgba(74, 222, 128, 1)"],
    transition: {
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

// Cloud switching animation
export const cloudSwitch = {
  exit: { 
    x: -30, 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  },
  initial: { 
    x: 30, 
    opacity: 0 
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Voice wave animation for speech detection
export const voiceWave = {
  initial: { scaleY: 0.1 },
  animate: {
    scaleY: [0.1, 0.7, 0.3, 0.9, 0.2, 0.6, 0.1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

// Data flow animation for AI system visualization
export const dataFlow = {
  initial: { strokeDashoffset: 1000 },
  animate: {
    strokeDashoffset: 0,
    transition: {
      duration: 3,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// System scan animation
export const systemScan = {
  initial: { scaleX: 0, opacity: 0.7 },
  animate: {
    scaleX: 1,
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

// AI thinking animation
export const aiThinking = {
  initial: { opacity: 0.5, scale: 0.9 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [0.9, 1, 0.9],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};
