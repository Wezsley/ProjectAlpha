import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Filter, Grid, List } from 'lucide-react';

export const FilesManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-bold text-slate-100 mb-2">Files & Resources</h1>
          <p className="text-slate-400">Manage your project files and assets</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-neon-cyan text-midnight-950 px-6 py-3 rounded-xl font-bold hover:shadow-glow-cyan transition-all flex items-center space-x-2"
        >
          <Upload size={20} />
          <span>Upload Files</span>
        </motion.button>
      </div>

      <div className="bg-midnight-800 rounded-2xl border border-neon-cyan/10 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 w-80 bg-midnight-900 border border-midnight-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-cyan transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-midnight-900 p-1 rounded-lg border border-neon-cyan/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors relative ${viewMode === 'grid' ? 'text-slate-100' : 'text-slate-400'}`}
            >
              {viewMode === 'grid' && <motion.div layoutId="view-bg" className="absolute inset-0 bg-neon-cyan/20 rounded-md" />}
              <Grid size={20} className="relative"/>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors relative ${viewMode === 'list' ? 'text-slate-100' : 'text-slate-400'}`}
            >
              {viewMode === 'list' && <motion.div layoutId="view-bg" className="absolute inset-0 bg-neon-cyan/20 rounded-md" />}
              <List size={20} className="relative"/>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-midnight-800 rounded-2xl border border-neon-cyan/10 overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-300">Coming Soon</h2>
            <p className="text-slate-500 mt-2">A secure file management system is on its way.</p>
        </div>
      </div>
    </div>
  );
};
