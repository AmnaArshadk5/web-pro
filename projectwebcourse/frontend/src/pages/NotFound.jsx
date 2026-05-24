import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12"
      >
        <div className="text-[180px] font-black text-forest/5 leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-peach/20 flex items-center justify-center">
            <AlertCircle size={80} className="text-terracotta animate-pulse" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6 max-w-md"
      >
        <h1 className="text-4xl font-black text-forest-dark">Lost in RuralPay?</h1>
        <p className="text-forest/60 text-lg">
          The page you are looking for doesn't exist or has been moved to a different location.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2 px-8 py-4">
            <Home size={20} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="px-8 py-4 rounded-2xl border-2 border-forest/10 text-forest font-bold hover:bg-forest/5 transition-all">
            Go Back
          </button>
        </div>
      </motion.div>

      {/* Decorative floating icons */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-[20%] text-forest/10"
      >
        <Search size={100} />
      </motion.div>
    </div>
  );
};

export default NotFound;
