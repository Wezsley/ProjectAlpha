import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Modal } from '../common/Modal';
import { NewProjectForm } from './NewProjectForm';

export const ProjectList: React.FC = () => {
  const { filteredProjects, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'active': return 'bg-neon-green/10 text-neon-green';
      case 'completed': return 'bg-neon-blue/10 text-neon-blue';
      case 'on-hold': return 'bg-neon-orange/10 text-neon-orange';
      default: return 'bg-slate-400/10 text-slate-400';
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading Projects...</div>;
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <NewProjectForm onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-header font-bold text-slate-100 mb-2">Projects</h1>
            <p className="text-slate-400">Manage and track all your creative projects</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)' }}
              className="bg-midnight-800 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-neon-cyan/10"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-2">{project.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{project.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-slate-400">
                    <Users size={14} className="mr-2" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Calendar size={14} className="mr-2" />
                    <span>Due {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-medium text-slate-100">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-midnight-700 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress || 0}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filteredProjects.length * 0.05 }}
            whileHover={{ y: -4, boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)' }}
            className="bg-midnight-800 rounded-2xl transition-all duration-300 cursor-pointer border-2 border-dashed border-neon-cyan/20 hover:border-neon-cyan/50 flex items-center justify-center min-h-[200px]"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="text-center text-neon-cyan">
              <Plus size={40} className="mx-auto mb-2" />
              <span className="font-semibold">New Project</span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
