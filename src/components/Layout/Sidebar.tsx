import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Settings,
  Eye,
} from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
  onLinkClick: () => void;
}

const navigationItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/tasks', label: 'Task Board', icon: CheckSquare },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/chat', label: 'Chat & Notes', icon: MessageSquare },
  { to: '/files', label: 'Files', icon: FileText },
  { to: '/client', label: 'Client View', icon: Eye },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onLinkClick }) => {
  return (
    <motion.div 
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-midnight-900 border-r border-neon-cyan/10 h-full flex flex-col"
    >
      <div className="p-6 border-b border-neon-cyan/10 flex-shrink-0 h-[81px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <motion.div 
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center space-x-3 ${!isExpanded ? 'pointer-events-none' : ''}`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center shadow-glow-cyan flex-shrink-0">
              <span className="text-midnight-950 font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-slate-100 whitespace-nowrap">Project Alpha</span>
          </motion.div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onLinkClick}
              end
              className={({ isActive }) =>
                `w-full flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} p-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-neon-cyan/10 text-neon-cyan shadow-inner shadow-neon-cyan/10' 
                    : 'text-slate-400 hover:bg-midnight-800 hover:text-slate-200'
                }`
              }
              title={!isExpanded ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              <motion.span
                animate={{ 
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? 'auto' : 0
                }}
                transition={{ duration: 0.2 }}
                className="font-semibold whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
              
              {!isExpanded && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-midnight-800 text-slate-200 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-neon-cyan/20 shadow-lg">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </motion.div>
  );
};
