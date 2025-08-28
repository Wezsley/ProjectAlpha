import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export const ClientView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-bold text-slate-100 mb-2">Client Portal</h1>
          <p className="text-slate-400">A dedicated space for your clients.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-neon-cyan text-midnight-950 px-6 py-3 rounded-xl font-bold hover:shadow-glow-cyan transition-all flex items-center space-x-2"
        >
          <MessageSquare size={20} />
          <span>Contact Client</span>
        </motion.button>
      </div>

      <div className="flex-1 bg-midnight-800 rounded-2xl border border-neon-cyan/10 overflow-hidden flex items-center justify-center min-h-[500px]">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-300">Coming Soon</h2>
            <p className="text-slate-500 mt-2">The client portal feature is currently in development.</p>
        </div>
      </div>
    </div>
  );
};
