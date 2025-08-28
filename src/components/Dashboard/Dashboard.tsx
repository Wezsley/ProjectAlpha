import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, CheckCircle, Activity } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { filteredProjects, filteredTasks, filteredProfiles, loading } = useData();

  const stats = [
    { label: 'Active Projects', value: filteredProjects.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'from-neon-blue to-blue-500', shadow: 'shadow-glow-blue' },
    { label: 'Team Members', value: filteredProfiles.length, icon: Users, color: 'from-neon-magenta to-purple-500', shadow: 'shadow-glow-magenta' },
    { label: 'Tasks Due Soon', value: filteredTasks.filter(t => t.status !== 'completed').length, icon: Clock, color: 'from-neon-orange to-red-500', shadow: 'shadow-glow-orange' },
    { label: 'Completed Tasks', value: filteredTasks.filter(t => t.status === 'completed').length, icon: CheckCircle, color: 'from-neon-green to-green-500', shadow: 'shadow-glow-green' },
  ];

  if (loading) {
    return <div className="text-center p-10">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-header font-bold text-slate-100 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-400 flex items-center">
            <Activity size={14} className="mr-1 text-neon-green" />
            Live System Overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-midnight-800 p-5 rounded-xl border border-neon-cyan/10 transition-all duration-300 ${stat.shadow} hover:border-neon-cyan/30`}
            >
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} inline-block mb-4`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-midnight-800 rounded-xl border border-neon-cyan/10 p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-100">Active Projects</h2>
          <Link to="/projects" className="text-sm text-neon-cyan hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.slice(0, 4).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="border border-midnight-700 rounded-lg p-4 hover:border-neon-cyan/50 transition-all duration-200"
            >
              <h3 className="font-medium text-slate-100 text-sm mb-1">{project.name}</h3>
              <p className="text-xs text-slate-400">{project.client}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                <span>Progress</span>
                <span>{project.progress || 0}%</span>
              </div>
              <div className="h-1.5 bg-midnight-700 rounded-full overflow-hidden mt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress || 0}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
