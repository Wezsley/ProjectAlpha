import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Menu, PanelLeft, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useData } from '../../contexts/DataContext';

interface HeaderProps {
  onMenuToggle: () => void;
  onSidebarToggle: () => void;
  sidebarExpanded: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle, 
  onSidebarToggle, 
  sidebarExpanded, 
}) => {
  const { searchTerm, setSearchTerm } = useData();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-midnight-900 border-b border-neon-cyan/10 px-4 lg:px-6 py-4 h-[81px] flex items-center">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-midnight-800 rounded-lg transition-colors lg:hidden"
          >
            <Menu size={20} className="text-slate-400" />
          </button>
          
          <motion.button
            onClick={onSidebarToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden lg:flex p-2 hover:bg-midnight-800 rounded-lg transition-colors"
            title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <PanelLeft size={20} className="text-slate-400" />
          </motion.button>
          
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 lg:w-96 bg-midnight-800 border border-midnight-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-all text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-midnight-800 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut size={20} className="text-neon-orange" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};
