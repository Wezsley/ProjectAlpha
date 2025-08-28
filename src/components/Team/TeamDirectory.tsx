import React from 'react';
import { motion } from 'framer-motion';
import { Mail, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const TeamDirectory: React.FC = () => {
  const { filteredProfiles, loading } = useData();

  if (loading) {
    return <div className="text-center p-10">Loading Team...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-bold text-slate-100 mb-2">Team Directory</h1>
          <p className="text-slate-400">Connect with your team members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProfiles.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)' }}
            className="bg-midnight-800 rounded-2xl transition-all duration-300 p-6 text-center border border-neon-cyan/10"
          >
            <div className="relative inline-block mb-4">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.full_name || 'Avatar'}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-neon-cyan/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-midnight-700 flex items-center justify-center mx-auto border-4 border-neon-cyan/20">
                  <User size={40} className="text-slate-400" />
                </div>
              )}
            </div>
            
            <h3 className="font-semibold text-slate-100 text-lg mb-1">{member.full_name || 'Team Member'}</h3>
            <p className="text-neon-cyan text-sm mb-4">{member.role || 'Team Member'}</p>
            
            <div className="flex items-center justify-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: '0 0 8px rgba(0, 229, 255, 0.5)' }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-neon-cyan/10 text-neon-cyan rounded-full transition-all"
              >
                <Mail size={18} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
