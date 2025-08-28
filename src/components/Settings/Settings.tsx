import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { profiles } = useData(); // Assuming current user is the first for now
  const currentUser = profiles[0];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'general', label: 'General', icon: Globe }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-bold text-slate-100 mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-neon-cyan text-midnight-950 px-6 py-3 rounded-xl font-bold hover:shadow-glow-cyan transition-all flex items-center space-x-2"
        >
          <Save size={20} />
          <span>Save Changes</span>
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 bg-midnight-800 rounded-xl border border-neon-cyan/10 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-neon-cyan/10 text-neon-cyan'
                      : 'text-slate-400 hover:bg-midnight-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 bg-midnight-800 rounded-xl border border-neon-cyan/10 p-6 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-300">Coming Soon</h2>
                <p className="text-slate-500 mt-2">The '{activeTab}' settings are under construction.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
