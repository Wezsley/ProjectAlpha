import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, Plus, Search } from 'lucide-react';

export const ChatNotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-header font-bold text-slate-100 mb-2">Communication Hub</h1>
          <p className="text-slate-400">Team chat and project notes</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-midnight-800 p-1 rounded-lg border border-neon-cyan/20">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-md transition-colors text-sm relative ${activeTab === 'chat' ? 'text-slate-100' : 'text-slate-400'}`}
          >
            {activeTab === 'chat' && <motion.div layoutId="hub-bg" className="absolute inset-0 bg-neon-cyan/20 rounded-md" />}
            <span className="relative">Team Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-md transition-colors text-sm relative ${activeTab === 'notes' ? 'text-slate-100' : 'text-slate-400'}`}
          >
            {activeTab === 'notes' && <motion.div layoutId="hub-bg" className="absolute inset-0 bg-neon-cyan/20 rounded-md" />}
            <span className="relative">Notes</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-midnight-800 rounded-2xl border border-neon-cyan/10 overflow-hidden flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-300">Coming Soon</h2>
            <p className="text-slate-500 mt-2">{activeTab === 'chat' ? 'Real-time chat functionality' : 'Collaborative notes feature'} is under construction.</p>
        </div>
      </div>
    </div>
  );
};
