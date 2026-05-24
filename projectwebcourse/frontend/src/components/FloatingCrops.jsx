import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const FloatingCrops = ({ count = 6, opacity = 0.05 }) => {
  const crops = Array.from({ length: count });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {crops.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-forest"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            rotate: 0,
            opacity: 0
          }}
          animate={{ 
            y: [null, Math.random() * -100 - 50, null],
            x: [null, Math.random() * 50 - 25, null],
            rotate: [0, 45, -45, 0],
            opacity: [0, opacity, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
          style={{ scale: Math.random() * 1.5 + 0.5 }}
        >
          <Leaf size={40} />
        </motion.div>
      ))}
      
      {/* Swaying Wheat Stalks at the bottom corners */}
      <motion.div 
        className="absolute bottom-[-20px] left-[10%] text-forest/10"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="120" height="200" viewBox="0 0 100 200" fill="currentColor">
          <path d="M50,200 Q40,100 50,0 M50,150 Q70,140 80,120 M50,100 Q30,90 20,70 M50,50 Q70,40 80,20" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </motion.div>

      <motion.div 
        className="absolute bottom-[-20px] right-[10%] text-forest/10 scale-x-[-1]"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <svg width="150" height="250" viewBox="0 0 100 200" fill="currentColor">
          <path d="M50,200 Q40,100 50,0 M50,150 Q70,140 80,120 M50,100 Q30,90 20,70 M50,50 Q70,40 80,20" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </motion.div>
    </div>
  );
};

export default FloatingCrops;
